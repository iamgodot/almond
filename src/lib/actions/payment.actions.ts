"use server"

import { stripe } from "@/lib/stripe"
import { getUser } from "./user.actions"

const PLANS: Plan[] = [
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
    stripeCurrentPeriodEnd: null,
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
    stripeCurrentPeriodEnd: null,
  },
]

export async function getUserSubscriptionPlan(userId: string): Promise<Plan> {
  const user = await getUser(userId)
  if (!user) {
    return {
      ...PLANS[0],
      isSubscribed: false,
      isCancelled: false,
      stripeCurrentPeriodEnd: null,
    }
  }
  const isSubscribed =
    user.stripePriceId &&
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() + 86_400_000 > Date.now()
  let plan = isSubscribed
    ? PLANS.find((plan) => plan.price.priceIds.test === user.stripePriceId)
    : PLANS[0]
  let isCancelled = false
  if (isSubscribed) {
    const sub = await stripe.subscriptions.retrieve(user.stripeSubscriptionId!)
    isCancelled = sub.cancel_at_period_end
  }
  return {
    ...(plan as Plan),
    stripeSubscriptionId: user.stripeSubscriptionId || "",
    stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
    stripeCustomerId: user.stripeCustomerId || "",
    isSubscribed,
    isCancelled,
  }
}

export async function createStripeSession(userId: string) {
  const user = await getUser(userId)
  if (!user) {
    return null
  }
  const returnUrl = process.env.STRIPE_RETURN_URL!
  const plan = await getUserSubscriptionPlan(userId)
  if (plan.isSubscribed && user.stripeCustomerId) {
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
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
    metadata: { clerkId: user.clerkId },
  })
  return session.url
}
