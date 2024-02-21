"use server";

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types";
import prisma from "../db";

export async function checkUser(user: KindeUser | null) {
    if (!user) throw new Error("User not found!");
    const userFromDb = await prisma.user.findFirst({
        where: {
            id: user.id,
        },
    });
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
