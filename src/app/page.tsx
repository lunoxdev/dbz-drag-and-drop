"use client";

import CharGrid from "./components/CharGrid";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function Home() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <CharGrid />
    </QueryClientProvider>
  );
}
