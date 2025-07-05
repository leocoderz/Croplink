"use client"

import type { ReactNode } from "react"

interface SecurityProviderProps {
  children: ReactNode
}

export function SecurityProvider({ children }: SecurityProviderProps) {
  // No security restrictions - just render children
  return <>{children}</>
}
