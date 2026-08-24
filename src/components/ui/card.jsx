import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card/90 border border-white/10 rounded-b-xl p-8 shadow-[0_0_40px_-10px_var(--color-secondary)]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(
      "font-display text-2xl font-bold mb-1 bg-gradient-to-r from-accent to-secondary bg-clip-text text-transparent",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-muted-foreground text-sm mb-6", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

export { Card, CardTitle, CardDescription };
