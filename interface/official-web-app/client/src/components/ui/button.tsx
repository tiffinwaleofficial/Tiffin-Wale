import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = {
  default: 'bg-primary text-white hover:bg-primary/90 transition duration-300',
  secondary: 'bg-secondary text-white hover:bg-secondary/90 transition duration-300',
  outline: 'bg-white text-primary border border-primary hover:bg-primary/10 transition duration-300',
  ghost: 'bg-transparent text-primary hover:bg-primary/10 transition duration-300',
  link: 'bg-transparent text-primary underline-offset-4 hover:underline transition duration-300',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 transition duration-300',
}

const buttonSizes = {
  default: 'h-10 py-2 px-4',
  sm: 'h-8 px-3 text-sm',
  lg: 'h-12 px-8 text-lg',
  icon: 'h-10 w-10',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? React.cloneElement : 'button';

    return (
      <button
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${buttonVariants[variant]} ${buttonSizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
