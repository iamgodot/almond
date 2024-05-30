"use server"

import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/dist/types"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import prisma from "@/db"
import { File } from "@prisma/client"
import { stripe } from "@/lib/stripe"

export async function getUser(): Promise<KindeUser | null> {
  const { getUser } = getKindeServerSession()
  return await getUser()
}

export async function checkUser() {
  const user = await getUser()
  if (!user) return null

  const userFromDb = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  })

  if (!userFromDb) {
    await prisma.user.create({
      data: {
        id: user.id,
        name: user.given_name,
        email: user.email,
      },
    })
  }

  return { user: user }
}

export async function getUserFiles(): Promise<Array<File>> {
  const user = await getUser()
  if (!user) {
    return []
  }
  return await prisma.file.findMany({
    where: { userId: user.id },
  })
}

export async function deleteUserFile(id: string): Promise<File | null> {
  const user = await getUser()
  if (!user) {
    return null
  }
  const file = await prisma.file.findFirst({
    where: {
      userId: user.id,
    },
  })
  if (!file) throw new Error("File not found!")
  await prisma.file.delete({
    where: { id: id },
  })
  return file
}

export async function getFileUploadStatus(
  fileId: string
): Promise<{ status: string | null }> {
  const user = await getUser()
  if (!user) {
    return { status: null }
  }
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  })
  if (!file) return { status: "PENDING" }
  return { status: file.uploadStatus }
}

export async function getFileById(fileId: string): Promise<File | null> {
  const user = await getUser()
  if (!user) {
    return null
  }
  const file = await prisma.file.findFirst({
    where: {
      id: fileId,
      userId: user.id,
    },
  })
  return file
}

const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagesPerPdf: 5,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Pro",
    slug: "pro",
    quota: 50,
    pagesPerPdf: 25,
    price: {
      amount: 14,
      priceIds: {
        test: "price_1PLwJ0JqtbAfu5ptQyMTaHoF",
        production: "",
      },
    },
  },
]

export async function getUserSubscriptionPlan() {
  const user = await getUser()
  if (!user) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCancelled: false,
      stripeCurrentPeriodEnd: null,
    }
  }
  const userFromDb = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  })
  if (!userFromDb) {
    console.log("User should be created in db now, something is wrong!")
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCancelled: false,
      stripeCurrentPeriodEnd: null,
    }
  }
  const isSubscribed =
    userFromDb.stripePriceId &&
    userFromDb.stripeCurrentPeriodEnd &&
    userFromDb.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  let plan = isSubscribed
    ? PLANS.find(
        (plan) => plan.price.priceIds.test === userFromDb.stripePriceId
      )
    : null
  let isCancelled = false
  if (isSubscribed) {
    const sub = await stripe.subscriptions.retrieve(
      userFromDb.stripeSubscriptionId!
    )
    isCancelled = sub.cancel_at_period_end
  }
  return {
    ...plan,
    stripeSubscriptionId: userFromDb.stripeSubscriptionId,
    stripeCurrentPeriodEnd: userFromDb.stripeCurrentPeriodEnd,
    stripeCustomerId: userFromDb.stripeCustomerId,
    isSubscribed,
    isCancelled,
  }
}

export async function createStripeSession() {
  const user = await getUser()
  if (!user) {
    return null
  }
  const userFromDb = await prisma.user.findFirst({
    where: {
      id: user.id,
    },
  })
  if (!userFromDb) {
    console.log("User should be created in db now, something is wrong!")
    return null
  }
  const returnUrl = process.env.STRIPE_RETURN_URL!
  const plan = await getUserSubscriptionPlan()
  if (plan.isSubscribed && userFromDb.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: userFromDb.stripeCustomerId,
      return_url: returnUrl,
    })
    return session.url
  }
  const session = await stripe.checkout.sessions.create({
    success_url: returnUrl,
    cancel_url: returnUrl,
    payment_method_types: ["card", "paypal"],
    mode: "subscription",
    billing_address_collection: "auto",
    line_items: [
      {
        price: PLANS[1].price.priceIds.test,
        quantity: 1,
      },
    ],
    metadata: { userId: user.id },
  })
  return session.url
}
