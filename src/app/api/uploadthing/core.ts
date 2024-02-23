import { getUser } from "@/app/actions"
import { createUploadthing, type FileRouter } from "uploadthing/next"
import prisma from "@/db"

const f = createUploadthing()

const auth = (req: Request) => ({ id: "fakeId" }) // Fake auth function

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
                await prisma.file.update({
                    data: { uploadStatus: "SUCCESS" },
                    where: { id: fileCreated.id },
                })
                return { id: fileCreated.id }
            }
        ),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
