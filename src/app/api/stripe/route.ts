import Stripe from "stripe"
import prisma from "@/db"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"

export async function POST(request: Request): Promise<Response> {
  const body = await request.text()
  const sig = headers().get("Stripe-Signature")
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    const msg = `Stripe webhook error: ${(error as Error).message}`
    console.log(msg)
    return new Response(msg, {
      status: 400,
    })
  }
  const session = event.data.object as Stripe.Checkout.Session
  const sub = await stripe.subscriptions.retrieve(
    session.subscription as string
  )
  if (event.type === "checkout.session.completed") {
    console.log("checkout.session.completed")
    const data = {
      stripeSubscriptionId: sub.id,
      stripeCustomerId: sub.customer as string,
      stripePriceId: sub.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
    }
    console.log(data)
    await prisma.user.update({
      where: { id: session.metadata!.userId },
      data: data,
    })
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("invoice.payment_succeeded")
    const data = {
      stripePriceId: sub.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
    }
    console.log(data)
    await prisma.user.update({
      where: { stripeSubscriptionId: sub.id },
      data: data,
    })
  }
  return new Response(null, { status: 200 })
}
