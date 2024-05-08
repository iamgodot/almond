import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import MaxWidthWrapper from "@/components/ui/MaxWidthWrapper"
import { buttonVariants } from "@/components/ui/button"
import Footer from "@/components/ui/Footer"
import { Usage } from "@/components/Usage"
import { Features } from "@/components/Features"
import { Pricing } from "@/components/Pricing"

export default function Home() {
    return (
        <>
            {/* Hero section */}
            <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col items-center justify-center text-center">
                <h1 className="font-bold text-4xl md:text-5xl">
                    Chat with your{" "}
                    <span className="text-green-600">Resume</span>
                </h1>
                <p className="mt-5 max-w-prose text-gray-600 sm:text-lg">
                    Almond allows you to have conversations upon your resume.
                    Simply upload your resume as a PDF file and start asking
                    questions right away.
                </p>

                <Link
                    className={buttonVariants({
                        size: "lg",
                        className: "mt-10",
                    })}
                    href="/dashboard"
                    target="_blank"
                >
                    Get started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
            </MaxWidthWrapper>

            <div className="flex justify-center px-5 py-8">
                <Image
                    src="/cover.png"
                    alt="product preview"
                    width={1364}
                    height={866}
                    quality={100}
                    className="rounded-md bg-white p-2 sm:p-8 md:p-20 shadow-2xl ring-1 ring-gray-900/10"
                />
            </div>

            <Features />
            <Usage />
            <Pricing />

            <Footer />
        </>
    )
}
