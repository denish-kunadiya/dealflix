import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-lg font-bold ring-offset-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-sky-500 text-slate-50  hover:bg-sky-600 disabled:bg-sky-100 disabled:text-sky-200 disabled:opacity-100',
        destructive: 'bg-red-500 text-slate-50 hover:bg-red-600',
        alert: 'bg-red-200 text-red-500 hover:bg-red-300',
        outline:
          'border border-sky-500 bg-transparent text-sky-500 hover:border-sky-600 hover:text-sky-600 disabled:border-sky-50 disabled:text-sky-200 disabled:opacity-100',
        secondary:
          'bg-sky-50 text-sky-500 hover:bg-sky-100 disabled:bg-sky-50 disabled:text-sky-200 disabled:opacity-100',
        ghost:
          'text-sky-500 hover:bg-sky-50 hover:text-sky-600 disabled:text-sky-200 disabled:opacity-100',
        link: 'text-sky-500 underline-offset-4 hover:underline',
        baseLink: 'text-base font-normal text-sky-500 underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-lg px-3 text-base',
        lg: 'h-11 rounded-lg px-8',
        xl: 'h-12 rounded-lg px-9',
        icon: 'h-10 w-10',
        inline: 'inline p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
