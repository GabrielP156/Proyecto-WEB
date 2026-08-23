import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold uppercase tracking-wide transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_0_20px_-4px_var(--color-primary)]",
        outline:
          "border border-accent/60 text-accent bg-transparent hover:bg-accent/10",
        ghost: "bg-transparent hover:bg-white/10 text-foreground",
        destructive:
          "bg-destructive text-destructive-foreground hover:brightness-110",
        neon:
          "bg-black/70 border border-cyan-500/50 text-cyan-300 hover:border-fuchsia-500/70 hover:text-fuchsia-300 hover:shadow-[0_0_20px_rgba(217,70,239,0.35)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-9 w-9 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
