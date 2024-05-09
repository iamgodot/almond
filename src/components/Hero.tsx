import React from "react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export const Hero = () => {
  return (
    <>
      <section className="container pt-48 pb-24 flex flex-col items-center text-center">
        <h1 className="font-bold text-4xl md:text-5xl">
          Chat with your <span className="text-green-600">Resume</span>
        </h1>
        <p className="mt-6 max-w-prose sm:text-lg dark:text-zinc-400">
          Almond allows you to have conversations upon your resume. Simply
          upload your resume as a PDF file and start asking questions right
          away.
        </p>

        <Link
          className={buttonVariants({
            size: "lg",
            className: "mt-10 w-full md:w-1/4",
          })}
          href="/dashboard"
          target="_blank"
        >
          Get started
        </Link>
      </section>
    </>
  )
}
