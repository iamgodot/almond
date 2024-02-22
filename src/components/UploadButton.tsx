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
            <DialogContent>
                <div className="flex flex-col h-64 m-4 border border-solid border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 items-center justify-between p-24">
                    <UploadDropzone
                        endpoint="pdfUploader"
                        onClientUploadComplete={(file) => {
                            router.push(`/dashboard/${file[0].serverData.id}`)
                        }}
                        onUploadError={(error: Error) => {
                            alert(`Upload error: ${error.message}`)
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UploadButton
