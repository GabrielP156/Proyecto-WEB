import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva("text-sm border rounded-md px-3 py-2", {
  variants: {
    variant: {
      danger: "border-destructive text-destructive",
      success: "border-success text-success",
    },
  },
  defaultVariants: {
    variant: "danger",
  },
});

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <p ref={ref} role="alert" className={cn(alertVariants({ variant, className }))} {...props} />
));
Alert.displayName = "Alert";

export { Alert, alertVariants };
