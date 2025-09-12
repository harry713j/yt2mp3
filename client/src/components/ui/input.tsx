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
        "w-full h-[48px] px-4 py-2 rounded-md border-2 border-slate-400/60 " + // default border
          "placeholder:text-slate-500/70 " +
          "transition-all duration-300 ease-in-out " + // smooth animation
          "focus:border-transparent focus:outline-2 focus:outline-blue-400",
        className,
      )}
      {...props}
    />
  );
}
