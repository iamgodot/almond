"use server"

import { revalidatePath } from "next/cache"
import UserModel from "../database/models/user.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase()
    const newUser = await UserModel.create(user)
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUser(clerkId: string) {
  try {
    await connectToDatabase()
    const user = await UserModel.findOne({ clerkId })
    if (!user) throw new Error("User not found for:" + clerkId)
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(
  identifier: UserIdentifier,
  user: UpdateUserParams
) {
  try {
    await connectToDatabase()
    const updatedUser = await UserModel.findOneAndUpdate(identifier, user, {
      new: true,
    })
    if (!updatedUser) throw new Error("User update failed")
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()
    const userToDelete = await UserModel.findOne({ clerkId })
    if (!userToDelete) {
      throw new Error("User not found")
    }
    const deletedUser = await UserModel.findByIdAndDelete(userToDelete._id)
    revalidatePath("/")
    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}
