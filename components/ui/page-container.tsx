import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageContainerProps {
    children: ReactNode;
    className?: string;
}

export function PageContainer({ children, className, ...props }: PageContainerProps) {
    return (
        <div className={cn("flex min-h-screen flex-col items-center bg-gradient-page", className)} {...props}>
            {children}
        </div>
    );
} 