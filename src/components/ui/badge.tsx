import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-brand-navy text-white",
        bajo: "bg-[#1fbf6c]/15 text-risk-low",
        moderado: "bg-[#eab308]/15 text-risk-moderate",
        alto: "bg-[#f97316]/15 text-risk-high",
        critico: "bg-[#ef4444]/15 text-risk-critical",
        outline: "border border-border-strong text-muted-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
