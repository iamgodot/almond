import { getUser } from "@/app/actions"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import prisma from "@/db"
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf"
import { getPineconeClient } from "@/lib/pinecone"
import { OpenAIEmbeddings } from "@langchain/openai"
import { PineconeStore } from "@langchain/pinecone"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"

const f = createUploadthing()

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await getUser()

      if (!user) throw new Error("Unauthorized")

      return { userId: user.id }
    })
    .onUploadComplete(
      async ({
        metadata,
        file,
      }: {
        metadata: any
        file: { key: string; name: string; url: string }
      }) => {
        const fileExisted = await prisma.file.findFirst({
          where: { key: file.key },
        })
        if (fileExisted) return { id: fileExisted.id }
        const fileCreated = await prisma.file.create({
          data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://utfs.io/f/${file.key}`,
            uploadStatus: "PROCESSING",
          },
        })
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

          await prisma.file.update({
            data: { uploadStatus: "SUCCESS" },
            where: { id: fileCreated.id },
          })
        } catch (error) {
          console.log("Upload file failed:")
          console.log(error)
          await prisma.file.update({
            data: { uploadStatus: "FAILED" },
            where: { id: fileCreated.id },
          })
        }
        return { id: fileCreated.id }
      }
    ),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
