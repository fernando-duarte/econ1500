"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Hero from "@/components/Hero";
import { PageContainer } from "@/components/ui/page-container";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const formSchema = z.object({
  name: z.string().min(1, "Enter your name"),
});

export default function Home() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    localStorage.setItem("playerName", values.name.trim());
    router.push("/game");
  }

  const handleScrollToForm = () => {
    document.getElementById('game-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageContainer>
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <Hero>
        <Button onClick={handleScrollToForm}>
          Get Started
        </Button>
      </Hero>

      <Container maxWidth="md">
        <Card id="game-form" className="my-12">
          <CardHeader>
            <CardTitle className="text-center">Join the Game</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={!form.getValues("name").trim()}
                >
                  Join Game
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </Container>
    </PageContainer>
  );
}
