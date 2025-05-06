/**
 * Game Settings Page
 *
 * Allows users to configure game settings.
 */
"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { SkipLink } from "@/components/ui/skip-link";
import { Typography } from "@/components/ui/typography";
import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";

export default function GameSettingsPage() {
  return (
    <AuthenticatedLayout>
      <Container className="flex flex-col items-center justify-center px-4">
        <SkipLink href="#settings-interface">Skip to settings interface</SkipLink>

        <Card
          id="settings-interface"
          className="w-full max-w-md shadow-lg focus-within:outline-none"
          tabIndex={-1}
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl font-bold">Game Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography.Muted className="text-center">
              Game settings configuration options will appear here.
            </Typography.Muted>
          </CardContent>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
