import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded px-1.5 py-0.5 text-sm font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: ' bg-slate-200 text-slate-50',
        select: ' bg-slate-200 text-slate-900',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
