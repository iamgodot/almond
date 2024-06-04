import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col items-center pt-24 space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-zinc-300" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-zinc-300" />
        <Skeleton className="h-4 w-[200px] bg-zinc-300" />
      </div>
    </div>
  )
}
