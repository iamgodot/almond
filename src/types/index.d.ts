declare type CreateUserParams = {
  clerkId: string
  email: string
  username: string
  firstName: string
  lastName: string
  photo: string
}

declare type UserIdentifier = {
  clerkId?: string
  stripeSubscriptionId?: string
}

declare type UpdateUserParams = {
  firstName?: string
  lastName?: string
  username?: string
  photo?: string
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  stripePriceId?: string
  stripeCurrentPeriodEnd?: Date
}

declare type CreateFileParams = {
  key: string
  name: string
  url: string
  user: string
  status: string
}

declare type FileIdentifier = {
  _id?: string
  key?: string
}

declare type UpdateFileParams = {
  status: string
}

declare type CreateMessageParams = {
  text: string
  isUserMessage: boolean
  user: string
  file: string
}

declare type Plan = {
  name: string
  slug: string
  quota: number
  pagesPerPdf: number
  price: {
    amount: number
    priceIds: {
      test: string
      production: string
    }
  }
  isSubscribed?: boolean
  isCancelled?: boolean
  stripeSubscriptionId?: string
  stripeCustomerId?: string
  stripeCurrentPeriodEnd?: Date | null
}
