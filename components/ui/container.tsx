import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full" | "none";
  centered?: boolean;
  className?: string;
}

export function Container({
  children,
  maxWidth = "xl",
  centered = true,
  className,
  ...props
}: ContainerProps) {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    full: "max-w-full",
    none: "",
  };

  return (
    <div className={cn("w-full", widths[maxWidth], centered && "mx-auto", className)} {...props}>
      {children}
    </div>
  );
}
