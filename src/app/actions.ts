"use server"

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "../db"
import { File } from "@prisma/client"

export async function checkUser(user: KindeUser | null) {
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
        });
    }

    return { user: user };
}
