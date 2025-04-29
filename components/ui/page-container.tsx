import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
  return (
    <div
      className={cn("bg-gradient-page flex min-h-screen flex-col items-center", className)}
      {...props}
    >
      {children}
    </div>
  );
}
