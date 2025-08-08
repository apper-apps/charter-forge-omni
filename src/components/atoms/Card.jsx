import React from "react"
import { cn } from "@/utils/cn"

const Card = React.forwardRef(({ children, className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-white border border-gray-200 shadow-md hover:shadow-lg",
    glass: "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl",
    gradient: "bg-gradient-to-br from-white to-gray-50 border border-gray-200 shadow-lg",
    elevated: "bg-white shadow-xl border-0"
  }

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl transition-all duration-300",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card