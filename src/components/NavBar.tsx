"use client"

import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import {
  FolderDot,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sun,
  SunMoon,
} from "lucide-react"
import Image from "next/image"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SignInButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs"
import { usePathname } from "next/navigation"

function NavBar() {
  const { user } = useUser()
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-40 w-full bg-white border-b dark:border-b-slate-700 dark:bg-background">
      <div className="flex items-center justify-between h-12 px-5 container mx-auto">
        <Link href="/" className="flex z-40 font-semibold">
          <span>Almond</span>
        </Link>
        {pathname === "/" && (
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
        )}
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
            {theme === "dark" ? <SunMoon /> : <Sun />}
          </Button>

          <SignedOut>
            <SignInButton>
              <LogIn className="mr-2 h-4 w-4 cursor-pointer" />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Image
                  src={user?.imageUrl || "https://i.pravatar.cc/150?img=2"}
                  width={40}
                  height={40}
                  alt="User"
                  className="rounded-full cursor-pointer"
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <FolderDot className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link href="/dashboard">
                  <DropdownMenuItem className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <SignOutButton signOutOptions={{ redirectUrl: "/" }} />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>
        </div>
      </div>
    </nav>
  )
}

export default NavBar
