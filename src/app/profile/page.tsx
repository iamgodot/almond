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
import { createStripeSession, getUserSubscriptionPlan } from "../actions"
import { format } from "date-fns"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const [plan, setPlan] = useState({})
  useEffect(() => {
    const getPlan = async () => {
      const stripePlan = await getUserSubscriptionPlan()
      setPlan(stripePlan)
      setLoading(false)
    }
    getPlan()
  }, [])
  if (loading) return <div>Loading...</div>
  return (
    <section className="container text-center py-24">
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const url = await createStripeSession()
          if (!url) {
            alert("Failed to create stripe session")
          } else {
            console.log("url", url)
            router.push(url)
          }
        }}
      >
        <Card className="flex items-center justify-between">
          <CardHeader className="">
            <CardTitle>Subscription Plan</CardTitle>
            <CardDescription>
              You are currently on {plan.name} plan.
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex items-center p-6">
            <Button>
              {plan.isSubscribed ? "Manage subscription" : "Upgrade to Pro"}
            </Button>
            {plan.isSubscribed && (
              <p>
                {plan.isCancelled
                  ? "You plan will be cancelled on "
                  : "Your plan will renew on "}
                {format(plan.stripeCurrentPeriodEnd, "dd/MM/yyyy")}
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </section>
  )
}
