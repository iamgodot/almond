import Stripe from "stripe"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { updateUser } from "@/lib/actions/user.actions"

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
    await updateUser(
      {
        clerkId: session.metadata!.cler,
      },
      data
    )
  }

  if (event.type === "invoice.payment_succeeded") {
    console.log("invoice.payment_succeeded")
    const data = {
      stripePriceId: sub.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
    }
    console.log(data)
    // FIX: need support for bulk update
    await updateUser({ stripeSubscriptionId: sub.id }, data)
  }
  return new Response(null, { status: 200 })
}
