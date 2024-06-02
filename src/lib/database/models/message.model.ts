import { Schema, model, Document } from "mongoose"
import { File } from "./file.model"
import { User } from "./user.model"

export interface Message extends Document {
    text: string
    isUserMessage: boolean
    user: User
    file: File
    createdAt: Date
    updatedAt: Date
}

const MessageSchema = new Schema(
    {
        text: {
            type: String,
            required: true,
        },
        isUserMessage: {
            type: Boolean,
            required: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        file: {
            type: Schema.Types.ObjectId,
            ref: "File",
            required: true,
        },
    },
    { timestamps: true }
)

const MessageModel = model("Message", MessageSchema)

export default MessageModel
