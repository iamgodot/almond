import React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Link from "next/link"

export const Usage = () => {
    return (
        <section id="usage" className="container text-center py-24">
            <h2 className="text-3xl lg:text-4xl font-bold text-center">
                A step-by-step guide for you to start
            </h2>
            <p className="mt-6 text-gray-600 text-center sm:text-lg">
                It has never been this easy to chat through your resume towards
                the best way to prepare yourself for the next job.
            </p>
            <div className="flex justify-center mt-16">
                <Carousel className="w-3/4 md:w-1/2">
                    <CarouselContent>
                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <span className="text-sm font-medium text-green-600">
                                            Step 1
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="text-xl font-semibold">
                                            Sign up for an account
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center mt-8 mb-28">
                                    <span className="text-zinc-700">
                                        You can register a new account or just
                                        login via your Google or GitHub account.
                                        After that either starting out with a
                                        free plan or choose our{" "}
                                        <Link
                                            href="/pricing"
                                            className="text-green-700 underline underline-offset-2"
                                        >
                                            pro plan
                                        </Link>
                                        .
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <span className="text-sm font-medium text-green-600">
                                            Step 2
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="text-xl font-semibold">
                                            Upload your resume in PDF
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center mt-8 mb-28">
                                    <span className="text-zinc-700">
                                        Your resume file will be properly
                                        processed in the fastest way and ready
                                        for you to chat with.
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                        <CarouselItem>
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        <span className="text-sm font-medium text-green-600">
                                            Step 3
                                        </span>
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="text-xl font-semibold">
                                            Start asking questions
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-center mt-8 mb-28">
                                    <span className="text-zinc-700">
                                        Ask anything you have in mind to improve
                                        your resume and get the best advice the
                                        AI specialized to help with your career.
                                    </span>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
