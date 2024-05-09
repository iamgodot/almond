"use client"

import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { Moon, Sun } from "lucide-react"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import Image from "next/image"
import { useTheme } from "next-themes"

function NavBar() {
    const { user } = useKindeBrowserClient()
    const { theme, setTheme } = useTheme()

    return (
        <nav className="sticky top-0 z-40 w-full bg-white border-b dark:border-b-slate-700 dark:bg-background">
            <div className="flex items-center justify-between h-12 px-5 container mx-auto">
                <Link href="/" className="flex z-40 font-semibold">
                    <span>Almond</span>
                </Link>
                {!user ? (
                    <div className="hidden sm:flex">
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
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        onClick={() => {
                            if (theme === "light") {
                                setTheme("dark")
                            } else {
                                setTheme("light")
                            }
                        }}
                    >
                        {theme === "dark" ? <Moon /> : <Sun />}
                    </Button>

                    {!user ? (
                        <>
                            <LoginLink
                                className={buttonVariants({
                                    variant: "ghost",
                                    size: "sm",
                                })}
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
        </nav>
    )
}

export default NavBar
