/**
 * Homepage - Simple Hello World page
 */
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-6">
      <h1 className="text-4xl font-bold">Hello World!</h1>

      <div className="flex gap-4">
        <Button>Default Button</Button>
        <Button variant="outline">Outline Button</Button>
        <Button variant="secondary">Secondary Button</Button>
        <Button variant="destructive">Destructive Button</Button>
      </div>

      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Shadcn UI Card Example</CardTitle>
            <CardDescription>This card component is added on demand</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This project now uses Shadcn UI with an on-demand installation approach.
              Components are added only when needed, and only the required Radix UI
              primitives are installed.</p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Learn More</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
