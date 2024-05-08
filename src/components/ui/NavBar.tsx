"use client"

import MaxWidthWrapper from "./MaxWidthWrapper"
import Link from "next/link"
import { Button, buttonVariants } from "./button"
import { ArrowRight, Moon, Nut, Sun } from "lucide-react"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import Image from "next/image"

function NavBar() {
    const { user } = useKindeBrowserClient()

    return (
        <nav className="sticky h-12 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
            <MaxWidthWrapper className="md:px-5">
                <div className="flex h-12 items-center justify-between border-b border-zinc-200">
                    <Link href="/" className="flex z-40 font-semibold">
                        <span>Almond</span>
                    </Link>
                    {!user ? (
                        <div>
                            <Link
                                href="#features"
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                Features
                            </Link>
                            <Link
                                href="#usage"
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                Usage
                            </Link>
                            <Link
                                href="#pricing"
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
                            >
                                Pricing
                            </Link>
                        </div>
                    ) : null}
                    <div className="hidden items-center gap-1 sm:flex">
                        <Button variant="ghost">
                            <Sun />
                        </Button>
                        {!user ? (
                            <>
                                <LoginLink
                                    className={buttonVariants({ size: "sm" })}
                                >
                                    Sign in
                                </LoginLink>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    })}
                                >
                                    Dashboard
                                </Link>
                                <LogoutLink
                                    className={buttonVariants({
                                        variant: "ghost",
                                        size: "sm",
                                    })}
                                >
                                    Sign out
                                </LogoutLink>
                                {user && (
                                    <Image
                                        src={user.picture}
                                        alt="user picture"
                                        width={48}
                                        height={48}
                                        className="rounded-md"
                                    />
                                )}
                            </>
                        )}
                    </div>
                </div>
            </MaxWidthWrapper>
        </nav>
    )
}

export default NavBar
