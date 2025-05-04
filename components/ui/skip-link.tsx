import { cn } from "@/lib/utils";

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}

export function SkipLink({ className, children, ...props }: SkipLinkProps) {
  return (
    <a
      className={cn(
        "focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:ring-2 focus:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );
}
