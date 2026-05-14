import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700",
        secondary: "bg-slate-100 text-slate-600",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        danger: "bg-red-50 text-red-700 ring-1 ring-red-200",
        info: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
        outline: "border border-slate-200 text-slate-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);

Badge.displayName = "Badge";
