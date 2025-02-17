import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/app/utils/shadcn"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm text-foreground font-medium transition-colors focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default:
                    "bg-primary shadow hover:bg-primary/90",
                secondary:
                    "bg-secondary text-foreground shadow hover:bg-secondary/90",
                destructive:
                    "bg-transparent border border-primary shadow-sm hover:bg-error hover:border-error",
                outline:
                    "border border-accent3 bg-transparent shadow-sm hover:bg-accent3 ",
                ghost: "hover:bg-accent1",
                link: "text-foreground underline-offset-4 hover:underline",
            },
            size: {
                default: "h-9 px-4 py-2",
                sm: "h-8 rounded-md px-3 text-xs",
                lg: "h-10 rounded-md px-8",
                icon: "h-9 w-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }