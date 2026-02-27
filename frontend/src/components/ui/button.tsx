import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

    const variants = {
      default: "bg-slate-900 text-white hover:bg-slate-800 shadow-md hover:shadow-lg hover:shadow-slate-900/20 active:scale-[0.98]",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:shadow-red-600/30 active:scale-[0.98]",
      outline: "border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 shadow-sm hover:shadow active:scale-[0.98]",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 shadow-sm hover:shadow active:scale-[0.98]",
      ghost: "hover:bg-slate-100 hover:text-slate-900",
      link: "text-slate-900 underline-offset-4 hover:underline"
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10"
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
