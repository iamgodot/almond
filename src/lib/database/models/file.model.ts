import { Schema, model, Document } from "mongoose"
import { User } from "./user.model"

export interface File extends Document {
  name: string
  status: string
  url: string
  key: string
  user: User
  createdAt: Date
  updatedAt: Date
}
const FileSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

const FileModel = model("File", FileSchema)

export default FileModel
