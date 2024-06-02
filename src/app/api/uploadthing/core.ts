import { auth } from "@clerk/nextjs/server"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import { getPineconeClient } from "@/lib/pinecone"
import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { createFile, getFile, updateFile } from "@/lib/actions/file.actions"

const f = createUploadthing()

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({}) => {
      const { userId } = auth()
      if (!userId) throw new Error("Unauthorized")
      return { userId }
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: any
        file: { key: string; name: string; url: string }
      }) => {
        const fileExisted = await getFile({ key: file.key })
        if (fileExisted) return { id: fileExisted.id }
        const fileCreated = await createFile({
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://utfs.io/f/${file.key}`,
          status: "PROCESSING",
        })
        if (!fileCreated) {
          console.log("Failed to create file after uploading")
          return null
        }
        try {
          const response = await fetch(`https://utfs.io/f/${file.key}`)
          const blob = await response.blob()
          const loader = new WebPDFLoader(blob)
          const pageLevelDocs = await loader.load()
          const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200,
          })
          const chunkedDocs = await textSplitter.splitDocuments(pageLevelDocs)
          const pinecone = await getPineconeClient()
          const pineconeIndex = pinecone.index(process.env.PINECONE_INDEX!)

          await PineconeStore.fromDocuments(
            chunkedDocs,
            new OpenAIEmbeddings(),
            { pineconeIndex, namespace: fileCreated.id, maxConcurrency: 5 }
          )

          await updateFile(file.key, { status: "SUCCESS" })
        } catch (error) {
          console.log("Upload file failed:")
          console.log(error)
          await updateFile(file.key, { status: "FAILED" })
        }
        return { id: fileCreated.id }
      }
    ),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
