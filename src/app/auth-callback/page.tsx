"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { checkUser } from "../actions";
import { Loader2 } from "lucide-react";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

function Page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const origin = searchParams.get("origin");

    const { user, isLoading } = useKindeBrowserClient();
    if (!isLoading) {
        (async () => {
            await checkUser(user);
        })()
            .then(() => router.push(origin ? `/${origin}` : "/dashboard"))
            .catch((error) => {
                console.log(error);
                router.push("/");
            });
    }

    return (
        <div className="w-full my-24 flex justify-center">
            <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-800" />
                <h3 className="font-semibold text-xl">Setting up your account...</h3>
                <p>You will be redirected automatically.</p>
            </div>
        </div>
    );
}

export default Page;
