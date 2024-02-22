"use server"

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/db"
import { File } from "@prisma/client"

export async function getUser(): Promise<KindeUser | null> {
    const { getUser } = getKindeServerSession()
    return await getUser()
}

export async function checkUser() {
    const user = await getUser()
    if (!user) throw new Error("User not found!")

    const userFromDb = await prisma.user.findFirst({
        where: {
            id: user.id,
        },
    })

    if (!userFromDb) {
        await prisma.user.create({
            data: {
                id: user.id,
                name: user.given_name,
                email: user.email,
            },
        })
    }

    return { user: user }
}

export async function getUserFiles(): Promise<Array<File>> {
    const user = await getUser()
    if (!user) {
        return []
    }
    return await prisma.file.findMany({
        where: { userId: user.id },
    })
}

export async function deleteUserFile(id: string): Promise<File | null> {
    const user = await getUser()
    if (!user) {
        return null
    }
    const file = await prisma.file.findFirst({
        where: {
            userId: user.id,
        },
    })
    if (!file) throw new Error("File not found!")
    await prisma.file.delete({
        where: { id: id },
    })
    return file
}
