"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function ReactQueryClientProvider({ children }: { children: React.ReactNode }) {
  // Ensure we use a single instance of QueryClient across rerenders
  const [client] = useState(() => queryClient);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
