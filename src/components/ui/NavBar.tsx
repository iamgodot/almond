"use client";

import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./button";
import { ArrowRight } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";

function NavBar() {
  const { user, error, isLoading } = useUser();
  console.log(user);

  return (
    <nav className="sticky h-12 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all">
      <MaxWidthWrapper className="md:px-5">
        <div className="flex h-12 items-center justify-between border-b border-zinc-200">
          <Link href="/" className="flex z-40 font-semibold">
            <span>Almond</span>
          </Link>
          <div className="hidden items-center space-x-4 sm:flex">
            <>
              <Link
                href="/pricing"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Pricing
              </Link>
              {user === undefined ? (
                <Link
                  href="/api/auth/login"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  Sign in
                </Link>
              ) : (
                <Link
                  href="/api/auth/logout"
                  className={buttonVariants({ variant: "ghost", size: "sm" })}
                >
                  {user.name} Sign out
                </Link>
              )}
              <Link href="/" className={buttonVariants({ size: "sm" })}>
                Get started <ArrowRight className="ml-1.5 h-5 w-5" />
              </Link>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}

export default NavBar;
