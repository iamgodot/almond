import { redirect } from "next/navigation"
import prisma from "../../db"
import React from "react"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import Dashboard from "@/components/Dashboard"

async function Page() {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
    if (!user) redirect("/auth-callback?origin=dashboard")
    const userFromDb = await prisma.user.findFirst({
        where: {
            id: user.id,
        },
    })
    if (!userFromDb) redirect("/auth-callback?origin=dashboard")
    return <Dashboard />
}

export default Page
