"use client"

import { getFileById } from "@/app/actions"
import { notFound } from "next/navigation"
import React, { useEffect, useState } from "react"
import PdfRenderer from "@/components/PdfRenderer"
import Chat from "@/components/Chat"
import { File } from "@prisma/client"

interface PageProps {
  params: {
    fileId: string
  }
}

function Page({ params }: PageProps) {
  const { fileId } = params
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const getFile = async () => {
      const fileById = await getFileById(fileId)
      if (!fileById) {
        notFound()
      } else {
        setFile(fileById)
      }
    }
    getFile()
  }, [fileId])

  return (
    <div className="flex flex-1 flex-col justify-between border lg:overflow-hidden lg:flex-row">
      {file && <PdfRenderer url={file.url} />}
      <Chat fileId={fileId} />
    </div>
  )
}

export default Page
