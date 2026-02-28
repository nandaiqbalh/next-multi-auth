import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A small animated underline used for hover effects.
 *
 * Can be customised through `className` if you need a different
 * colour, height, transition duration, etc.
 *
 * ```jsx
 * <Underline />
 * <Underline className="bg-primary h-[1px]" />
 * ```
 */
export default function Underline({ className = "" }) {
  return (
    <span
      className={cn(
        "absolute left-0 -bottom-1 h-[2px] w-0 bg-white transition-all duration-300 group-hover:w-full",
        className
      )}
    />
  );
}
