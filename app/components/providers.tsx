'use client'

import { Toaster } from "./ui/toaster"
import { Toaster as Sonner } from "./ui/sonner"
import { TooltipProvider } from "./ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from 'react'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster />
          <Sonner />
          {children}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  )
}