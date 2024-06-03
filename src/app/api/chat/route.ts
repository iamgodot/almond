import { getPineconeStore } from "@/lib/pinecone"
import { auth } from "@clerk/nextjs/server"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { LangChainAdapter, StreamingTextResponse } from "ai"
import { formatDocumentsAsString } from "langchain/util/document"
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { createMessage, getMessagesByFile } from "@/lib/actions/message.actions"
import { getUser } from "@/lib/actions/user.actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")
  if (!fileId) return Response.json([])
  const messages = await getMessagesByFile(fileId)
  return Response.json(messages)
}

const condenseQuestionTemplate = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.

Chat History:
{chat_history}
Follow Up Input: {question}
Standalone question:`
const CONDENSE_QUESTION_PROMPT = PromptTemplate.fromTemplate(
  condenseQuestionTemplate
)
const answerTemplate = `Your task is to assist with resume optimization. Start by verifying if the provided context is a resume. If it is not, simply reply with "I can only give suggestions for resumes." If it is a resume, answer questions strictly related to improving the resume using only the information in the context. If the question cannot be answered based on the given context, respond with "Sorry, I don't know enough information to answer this question." Avoid guessing or fabricating answers.

Context: {context}

Question: {question}`

const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate)

export async function POST(req: Request) {
  // FIX: ambiguous userId which actually is clerkId(not just here)
  const { userId } = auth()
  if (!userId) {
    return new Response("Unauthorized", { status: 401 })
  }
  const user = await getUser(userId)
  const { messages, fileId } = await req.json()
  const currentMessageContent = messages[messages.length - 1].content

  const savedMessages = await getMessagesByFile(fileId)
  const previousMessages = savedMessages.slice(0, -1).map((message) => {
    return `${message.isUserMessage ? "user" : "assistant"}: ${message.text}`
  })
  await createMessage({
    text: currentMessageContent,
    isUserMessage: true,
    user: user._id,
    file: fileId,
  })
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-3.5-turbo",
    temperature: 0,
    streaming: true,
    verbose: false,
  })
  const pineconeStore = await getPineconeStore(fileId)
  const retriever = pineconeStore.asRetriever()
  type ConversationalRetrievalQAChainInput = {
    question: string
    chat_history: string[]
  }
  const standaloneQuestionChain = RunnableSequence.from([
    {
      question: (input: ConversationalRetrievalQAChainInput) => input.question,
      chat_history: (input: ConversationalRetrievalQAChainInput) =>
        input.chat_history.join("\n"),
    },
    CONDENSE_QUESTION_PROMPT,
    model,
    new StringOutputParser(),
  ])
  const answerChain = RunnableSequence.from([
    {
      context: retriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
    },
    ANSWER_PROMPT,
    model,
  ])
  const conversationalRetrievalQAChain =
    standaloneQuestionChain.pipe(answerChain)
  const stream = await conversationalRetrievalQAChain.stream({
    question: currentMessageContent,
    chat_history: previousMessages,
  })
  const aiStream = LangChainAdapter.toAIStream(stream, {
    async onCompletion(completion: string) {
      await createMessage({
        text: completion,
        isUserMessage: false,
        user: user._id,
        file: fileId,
      })
    },
  })
  return new StreamingTextResponse(aiStream)
}
