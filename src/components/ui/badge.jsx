import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded border px-3 py-1 text-xs font-mono uppercase tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default: "border-accent/50 text-accent bg-black/40",
        success: "border-success/50 text-success bg-black/40",
        danger: "border-destructive/50 text-destructive bg-black/40",
        warning: "border-warning/50 text-warning bg-black/40",
        info: "border-info/50 text-info bg-black/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
