import { type InputHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted-light outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent",
        className
      )}
      {...props}
    />
  );
}
