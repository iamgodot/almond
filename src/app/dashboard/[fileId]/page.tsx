"use client"

import { notFound } from "next/navigation"
import React, { useEffect, useState } from "react"
import PdfRenderer from "@/components/PdfRenderer"
import Chat from "@/components/Chat"
import { getFile } from "@/lib/actions/file.actions"
import { Message } from "@/lib/database/models/message.model"
import { File } from "@/lib/database/models/file.model"

interface PageProps {
    params: {
        fileId: string
    }
}

function Page({ params }: PageProps) {
    const { fileId } = params
    const [file, setFile] = useState<File | null>(null)
    const [messages, setMessages] = useState<Message[]>([])

    useEffect(() => {
        ; (async () => {
            // Get file
            const file = await getFile({ fileId })
            if (!file) {
                notFound()
            } else {
                setFile(file)
            }
            // Get messages
            const res = await fetch(`/api/chat?fileId=${fileId}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        })()
    }, [fileId])

    return (
        <div className="flex flex-1 flex-col justify-between border lg:overflow-hidden lg:flex-row">
            {file && <PdfRenderer url={file.url} />}
            <Chat fileId={fileId} prevMessages={messages} />
        </div>
    )
}

export default Page
