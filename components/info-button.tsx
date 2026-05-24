"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface InfoButtonProps {
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left"
  className?: string
}

export function InfoButton({ content, side = "top", className = "" }: InfoButtonProps) {
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // For mobile devices, use Popover (stays open until clicked outside)
  if (isMobile) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${className}`}>
            <Info className="h-4 w-4 text-green-700" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side={side} className="max-w-sm text-sm">
          {content}
        </PopoverContent>
      </Popover>
    )
  }

  // For desktop, use Tooltip (appears on hover)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className={`h-6 w-6 ${className}`}>
            <Info className="h-4 w-4 text-green-700" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side={side} className="max-w-sm">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
