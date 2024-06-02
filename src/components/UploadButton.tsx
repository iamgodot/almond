"use client"

import React from "react"
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { UploadDropzone } from "@/lib/utils"
import { useRouter } from "next/navigation"

function UploadButton() {
  const router = useRouter()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload PDF</Button>
      </DialogTrigger>
      <DialogContent className="flex items-center justify-center h-80 rounded-lg p-24">
        <UploadDropzone
          className="dark:bg-slate-800 ut-label:text-md ut-button:bg-blue-600 ut-button:ut-uploading:bg-blue-500"
          endpoint="pdfUploader"
          onClientUploadComplete={(file) => {
            if (file[0]?.serverData?.id) {
              router.push(`/dashboard/${file[0].serverData.id}`)
            }
          }}
          onUploadError={(error: Error) => {
            console.log(`Upload error: ${error.message}`)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}

export default UploadButton
