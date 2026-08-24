import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "w-full border border-input bg-transparent rounded px-3 py-2 text-sm text-foreground",
      "placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
