import React from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Check, X } from "lucide-react"

export const Pricing = () => {
  return (
    <section id="pricing" className="container py-24 text-center">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold">Pricing</h2>
        <p className="mt-6 mb-16 max-w-prose text-zinc-400 sm:text-lg">
          Whether you&apos;re just trying out our service or need more,
          we&apos;ve got you covered!
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex item-center justify-center">
              Free
            </CardTitle>
            <div className="flex items-center justify-center gap-2 py-3">
              <span className="text-3xl font-bold">$0</span>
              <span className="text-muted-foreground"> per month</span>
            </div>

            <CardDescription>
              For small-sized files and limited chats.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full">Get started</Button>
          </CardContent>

          <CardFooter className="flex">
            <div className="space-y-4">
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">5 pages per PDF</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">4MB file size limit</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">Mobile-friendly interface</h3>
              </span>
              <span className="flex">
                <X className="text-red-500" />{" "}
                <h3 className="ml-2">High-quality responses</h3>
              </span>
              <span className="flex">
                <X className="text-red-500" />{" "}
                <h3 className="ml-2">Priority support</h3>
              </span>
            </div>
          </CardFooter>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex item-center justify-center">
              Pro
            </CardTitle>
            <div className="flex items-center justify-center gap-2 py-3">
              <span className="text-3xl font-bold">$20</span>
              <span className="text-muted-foreground"> per month</span>
            </div>
            <CardDescription>
              For large files and unlimited chats.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button className="w-full">Get started</Button>
          </CardContent>

          <CardFooter className="flex">
            <div className="space-y-4">
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">5 pages per PDF</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">4MB file size limit</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">Mobile-friendly interface</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">High-quality responses</h3>
              </span>
              <span className="flex">
                <Check className="text-green-500" />{" "}
                <h3 className="ml-2">Priority support</h3>
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
