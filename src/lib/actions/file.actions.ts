"use server"

import FileModel, { File } from "../database/models/file.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"
import { getUser } from "./user.actions"

export async function createFile(file: CreateFileParams): Promise<File | null> {
  try {
    await connectToDatabase()
    const newFile = await FileModel.create(file)
    return JSON.parse(JSON.stringify(newFile))
  } catch (error) {
    handleError(error)
    return null
  }
}

export async function getFile(
  identifier: FileIdentifier
): Promise<File | null> {
  try {
    await connectToDatabase()
    return await FileModel.findOne(identifier)
  } catch (error) {
    handleError(error)
    return null
  }
}

export async function getFilesByUser(clerkId: string): Promise<File[]> {
  try {
    await connectToDatabase()
    const user = await getUser(clerkId)
    return await FileModel.find({ user: user._id })
  } catch (error) {
    handleError(error)
    return []
  }
}

export async function updateFile(
  key: string,
  file: UpdateFileParams
): Promise<File | null> {
  try {
    await connectToDatabase()
    return await FileModel.findOneAndUpdate({ key }, file, {
      new: true,
    })
  } catch (error) {
    handleError(error)
    return null
  }
}

export async function deleteFile(
  clerkId: string,
  fileId: string
): Promise<File | null> {
  try {
    await connectToDatabase()
    const user = await getUser(clerkId)
    return await FileModel.findOneAndDelete({ user: user._id, _id: fileId })
  } catch (error) {
    handleError(error)
    return null
  }
}
