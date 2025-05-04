import { cn } from "@/lib/utils";
import React from "react";

export type TypographyProps = React.HTMLAttributes<HTMLElement>;

const Typography = {
  H1: ({ className, ...props }: TypographyProps) => (
    <h1
      className={cn("scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl", className)}
      {...props}
    />
  ),
  H2: ({ className, ...props }: TypographyProps) => (
    <h2
      className={cn(
        "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
        className
      )}
      {...props}
    />
  ),
  H3: ({ className, ...props }: TypographyProps) => (
    <h3 className={cn("scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props} />
  ),
  H4: ({ className, ...props }: TypographyProps) => (
    <h4 className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props} />
  ),
  P: ({ className, ...props }: TypographyProps) => (
    <p className={cn("leading-7 [&:not(:first-child)]:mt-6", className)} {...props} />
  ),
  Blockquote: ({ className, ...props }: TypographyProps) => (
    <blockquote className={cn("mt-6 border-l-2 pl-6 italic", className)} {...props} />
  ),
  Muted: ({ className, ...props }: TypographyProps) => (
    <p className={cn("text-muted-foreground text-sm", className)} {...props} />
  ),
  Lead: ({ className, ...props }: TypographyProps) => (
    <p className={cn("text-muted-foreground text-xl", className)} {...props} />
  ),
  Large: ({ className, ...props }: TypographyProps) => (
    <div className={cn("text-lg font-semibold", className)} {...props} />
  ),
  Small: ({ className, ...props }: TypographyProps) => (
    <small className={cn("text-sm leading-none font-medium", className)} {...props} />
  ),
};

export { Typography };
