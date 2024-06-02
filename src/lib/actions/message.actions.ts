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

export async function getMessages(identifier: MessageIdentifier) {
    try {
        await connectToDatabase()
        const messages = await MessageModel.find(identifier, null, {
            sort: { createdAt: 1 },
        })
            .populate("user")
            .exec()
        // TODO: check if there's an id field automatically generated
        return messages
    } catch (error) {
        handleError(error)
        return []
    }
}
