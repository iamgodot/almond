import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { buttonVariants } from "./button";
import { ArrowRight } from "lucide-react";

function NavBar() {
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
              <Link
                href="/"
                className={buttonVariants({ variant: "ghost", size: "sm" })}
              >
                Sign in
              </Link>
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
