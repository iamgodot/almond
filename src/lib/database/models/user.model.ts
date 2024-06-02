import { Schema, model, models, Document } from "mongoose"

export interface User extends Document {
  clerkId: string
  email: string
  username: string
  photo: string
  firstName?: string
  lastName?: string
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string
  stripeCurrentPeriodEnd?: string
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    photo: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
      unique: true,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
    },
    stripePriceId: {
      type: String,
    },
    stripeCurrentPeriodEnd: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

const UserModel = models?.UserModel || model("UserModel", UserSchema)

export default UserModel
