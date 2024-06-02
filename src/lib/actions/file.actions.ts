"use server"

import FileModel, { File } from "../database/models/file.model"
import { connectToDatabase } from "../database/mongoose"
import { handleError } from "../utils"

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

export async function getFilesByUser(userId: string): Promise<File[]> {
    try {
        await connectToDatabase()
        return await FileModel.find({ userId })
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
    userId: string,
    fileId: string
): Promise<File | null> {
    try {
        await connectToDatabase()
        return await FileModel.findOneAndDelete({ userId, fileId })
    } catch (error) {
        handleError(error)
        return null
    }
}
