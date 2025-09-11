import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "w-full h-[48px] px-4 py-2 transition-all duration-200 delay-50 outline-1 outline-transparent" +
          "outline-slate-500/30 rounded-sm focus:border-none focus:outline-2 focus:outline-blue-500 placeholder:text-slate-500/70",
        className,
      )}
      {...props}
    />
  );
}
