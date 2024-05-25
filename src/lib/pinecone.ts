import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { Pinecone } from "@pinecone-database/pinecone"

let pineconeClient: Pinecone | null = null

export async function getPineconeClient() {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    })
  }
  return pineconeClient
}

export async function getPineconeStore(namespace: string) {
  const client = await getPineconeClient()
  const pineconeIndex = client.index(process.env.PINECONE_INDEX!)
  const vectorStore = await PineconeStore.fromExistingIndex(
    new OpenAIEmbeddings(),
    { pineconeIndex, namespace }
  )
  return vectorStore
}
