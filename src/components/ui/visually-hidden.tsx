"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface VisuallyHiddenProps {
  children: ReactNode
  className?: string
}

export function VisuallyHidden({ children, className }: VisuallyHiddenProps) {
  return (
    <span
      className={cn(
        "absolute w-[1px] h-[1px] p-0 -m-[1px] overflow-hidden clip-[rect(0,0,0,0)] whitespace-nowrap border-0",
        className
      )}
    >
      {children}
    </span>
  )
}
