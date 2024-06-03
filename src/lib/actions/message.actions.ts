"use server"

import MessageModel, { Message } from "../database/models/message.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

export async function createMessage(
  message: CreateMessageParams
): Promise<Message | null> {
  try {
    await connectToDatabase()
    const newMessage = await MessageModel.create(message)
    // TODO: check if we can simply return the object
    return JSON.parse(JSON.stringify(newMessage))
  } catch (error) {
    handleError(error)
    return null
  }
}

export async function getMessagesByFile(fileId: string) {
  try {
    await connectToDatabase()
    // FIX: why .populate("user").exec() didn't work?
    const messages = await MessageModel.find({ file: fileId }, null, {
      sort: { createdAt: 1 },
    })
    // TODO: check if there's an id field automatically generated
    return messages
  } catch (error) {
    handleError(error)
    return []
  }
}
