import { cn } from "@/lib/utils";

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: "0" | "1" | "2" | "3" | "4" | "5" | "6" | "8" | "10";
  direction?: "row" | "column";
}

export function Stack({ gap = "4", direction = "column", className, ...props }: StackProps) {
  return (
    <div
      className={cn(direction === "column" ? `space-y-${gap}` : `space-x-${gap}`, className)}
      {...props}
    />
  );
}
