import { cn } from "@/lib/utils";
import type React from "react";

export function Footer({
  className,
  ...props
}: React.ComponentProps<"footer">) {
  return (
    <footer
      className={cn(
        "flex justify-start items-center bg-gray-600 px-1 py-0.5",
        className,
      )}
      {...props}
    >
      <p className="text-sm text-slate-400">
        © {new Date().getFullYear()} YT2Mp3. All rights reserved.
      </p>
    </footer>
  );
}
