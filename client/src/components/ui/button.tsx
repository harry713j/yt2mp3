import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "bg-blue-400 text-white px-4 py-2 shadow-sm rounded-sm transition-colors duration-200 delay-100 cursor-pointer hover:bg-blue-500",
        className,
      )}
      {...props}
    />
  );
}
