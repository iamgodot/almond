import { getUser } from "@/app/actions"
import { notFound, redirect } from "next/navigation"
import React from "react"
import prisma from "@/db"
import PdfRenderer from "@/components/PdfRenderer"
import ChatWrapper from "@/components/chat/ChatWrapper"

interface PageProps {
    params: {
        fileid: string
    }
}

async function Page({ params }: PageProps) {
    const { fileid } = params
    const user = await getUser()
    if (!user) redirect(`/auth-callback?origin=dashboard/${fileid}`)

    const file = await prisma.file.findFirst({
        where: {
            id: fileid,
            userId: user.id,
        },
    })
    if (!file) notFound()
    return (
        <div className="flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]">
            <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
                {/* Left sidebar & main wrapper */}
                <div className="flex-1 xl:flex">
                    <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
                        {/* Main area */}
                        <PdfRenderer />
                    </div>
                </div>

                <div className="shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0">
                    <ChatWrapper />
                </div>
            </div>
        </div>
    )
}

export default Page
