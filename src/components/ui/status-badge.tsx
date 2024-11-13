import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const statusBadgeVariants = cva(
  'focus:ring-ring inline-flex flex-shrink-0 items-center rounded px-2 py-1 text-sm font-normal uppercase text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'bg-sky-500',
        initiated: 'bg-amber-400',
        available: 'bg-emerald-400',
        assigned: 'bg-purple-400',
        inProgress: 'bg-sky-500',
        qcSubmitted: 'bg-sky-400',
        qcAccepted: 'bg-emerald-400',
        qcRejected: 'bg-rose-400',
        gseSubmitted: 'bg-orange-400',
        gseAccepted: 'bg-green-400',
        gseRejected: 'bg-red-400',
        complete: 'bg-emerald-500',
      },
      size: {
        default: 'h-5 px-1 py-0.5 text-xs leading-none',
        lg: 'h-[25px] text-sm leading-[17px]',
        sm: 'h-[18px] px-[5px] py-0.5 text-xs leading-[14px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {}

function StatusBadge({ className, variant, size, ...props }: StatusBadgeProps) {
  return (
    <div
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

const statusBadgeLightVariants = cva(
  'focus:ring-ring inline-flex flex-shrink-0 items-center rounded border px-2 py-1 text-sm font-normal text-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-sky-500 bg-sky-100 text-sky-500',
        initiated: 'border-amber-400 bg-amber-100 text-amber-400',
        available: 'border-emerald-400 bg-emerald-100 text-emerald-400',
        assigned: 'border-purple-400 bg-purple-100 text-purple-400',
        inProgress: 'border-sky-500 bg-sky-100 text-sky-500',
        qcSubmitted: 'border-sky-400 bg-sky-100 text-sky-400',
        qcAccepted: 'border-emerald-400 bg-emerald-100 text-emerald-400',
        qcRejected: 'border-rose-400 bg-rose-100 text-rose-400',
        gseSubmitted: 'border-orange-400 bg-orange-100 text-orange-400',
        gseAccepted: 'border-green-400 bg-green-100 text-green-400',
        gseRejected: 'border-red-400 bg-red-100 text-red-400',
        complete: 'border-emerald-500 bg-emerald-100 text-emerald-500',

        gseSubmittedLight: 'border border-orange-400 bg-orange-400',
      },
      size: {
        default: 'h-5 px-1 py-0.5 text-xs leading-none',
        lg: 'py-3px h-[25px] px-[7px] text-sm leading-[17px]',
        sm: 'h-[18px] px-[4px] py-px text-xs leading-[14px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface StatusBadgeLightProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeLightVariants> {}

function StatusBadgeLight({ className, variant, size, ...props }: StatusBadgeLightProps) {
  return (
    <div
      className={cn(statusBadgeLightVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { StatusBadge, statusBadgeVariants, StatusBadgeLight, statusBadgeLightVariants };
