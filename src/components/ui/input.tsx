import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const inputVariants = cva(
  'border-input ring-offset-background focus-visible:ring-ring flex w-full rounded-md border bg-slate-50 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:border-sky-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'border-slate-200',
        destructive: 'border-red-500',
      },
      elementSize: {
        default: 'h-[42px] px-4 py-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      elementSize: 'default',
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, elementSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, elementSize, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
