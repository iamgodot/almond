"use client"

import React, { useEffect, useState } from "react"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { UserProfile } from "@clerk/nextjs"
import {
  createStripeSession,
  getUserSubscriptionPlan,
} from "@/lib/actions/payment.actions"
import { useAuth } from "@clerk/nextjs"

export default function Page() {
  const router = useRouter()
  const [plan, setPlan] = useState<Plan | null>(null)
  const { userId } = useAuth()

  useEffect(() => {
    const getPlan = async () => {
      const stripePlan = await getUserSubscriptionPlan(userId || "")
      setPlan(stripePlan)
    }
    getPlan()
  }, [userId])
  return (
    <section className="container flex flex-col items-start py-8 gap-6">
      {plan && (
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const url = await createStripeSession(userId || "")
            if (!url) {
              alert("Failed to create stripe session")
            } else {
              console.log("url", url)
              router.push(url)
            }
          }}
        >
          <Card className="w-full flex items-center justify-between">
            <CardHeader className="">
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                You are currently on {plan!.name} plan.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center p-6">
              <Button>
                {plan!.isSubscribed ? "Manage subscription" : "Upgrade to Pro"}
              </Button>
              {plan!.isSubscribed && plan!.stripeCurrentPeriodEnd && (
                <p>
                  {plan!.isCancelled
                    ? "You plan will be cancelled on "
                    : "Your plan will renew on "}
                  {format(plan!.stripeCurrentPeriodEnd, "dd/MM/yyyy")}
                </p>
              )}
            </CardFooter>
          </Card>
        </form>
      )}
      <div className="w-full">
        <UserProfile routing="hash" />
      </div>
    </section>
  )
}
