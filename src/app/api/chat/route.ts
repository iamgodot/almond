import { getPineconeStore } from "@/lib/pinecone"
import { ChatOpenAI } from "@langchain/openai"
import { PromptTemplate } from "@langchain/core/prompts"
import { LangChainAdapter, StreamingTextResponse } from "ai"
import { formatDocumentsAsString } from "langchain/util/document"
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables"
import { StringOutputParser } from "@langchain/core/output_parsers"
import prisma from "@/db"
import { getUser } from "@/app/actions"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const fileId = searchParams.get("fileId")
  const messages = await prisma.message.findMany({
    where: { fileId },
    orderBy: { createdAt: "asc" },
  })
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
const answerTemplate = `Answer the question based only on the following context:
{context}

Question: {question}
`
const ANSWER_PROMPT = PromptTemplate.fromTemplate(answerTemplate)

export async function POST(req: Request) {
  const user = await getUser()
  if (!user) {
    return new Response("User not found", { status: 404 })
  }
  const userId = user.id
  const { messages, fileId } = await req.json()
  const currentMessageContent = messages[messages.length - 1].content

  const savedMessages = await prisma.message.findMany({
    where: { fileId },
    orderBy: { createdAt: "asc" },
  })
  const previousMessages = savedMessages.slice(0, -1).map((message) => {
    return `${message.isUserMessage ? "user" : "assistant"}: ${message.text}`
  })
  await prisma.message.create({
    data: {
      text: currentMessageContent,
      isUserMessage: true,
      userId,
      fileId,
    },
  })
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
    model: "gpt-3.5-turbo",
    temperature: 0,
    streaming: true,
    verbose: true,
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
      await prisma.message.create({
        data: {
          text: completion,
          isUserMessage: false,
          userId,
          fileId,
        },
      })
    },
  })
  return new StreamingTextResponse(aiStream)
}
