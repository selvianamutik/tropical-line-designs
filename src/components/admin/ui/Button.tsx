import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "danger"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    
    // Classes based on variants
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-sm text-[11px] font-bold tracking-widest uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d97706] disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      default: "bg-[#383532] text-[#FDFBF7] shadow hover:bg-[#383532]/90",
      outline: "border border-[#d9d4ca] bg-transparent text-[#383532] shadow-sm hover:bg-[#f4efe6]",
      ghost: "text-[#383532] hover:bg-[#f4efe6]",
      danger: "bg-[#e86654] text-white shadow-sm hover:bg-[#e86654]/90",
    }
    
    const sizeClasses = {
      default: "h-9 px-4 py-2",
      sm: "h-8 px-3 text-[10px]",
      lg: "h-10 px-8 text-xs",
      icon: "h-9 w-9",
    }

    return (
      <button
        className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
