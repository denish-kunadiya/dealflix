'use client';

import 'react-toastify/dist/ReactToastify.css';
import '@/app/globals.css';
import { ToastContainer } from 'react-toastify';
import { cn } from '@/utils/cn';
import { cva, type VariantProps } from 'class-variance-authority';

interface ToastProviderProps {
  children: React.ReactNode;
}

const containerAlertsVariants = cva(
  'relative mb-2.5 flex min-h-10 w-full cursor-pointer justify-between overflow-hidden rounded-xl p-3.5 shadow',
  {
    variants: {
      variant: {
        default: 'bg-slate-50',
        success: 'bg-emerald-100',
        error: 'bg-red-100',
        info: 'bg-sky-100',
        warning: 'bg-orange-50',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const bodyAlertsVariants = cva('flex items-start text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-slate-500',
      success: 'text-emerald-400',
      error: 'text-red-500',
      info: 'text-sky-500',
      warning: 'text-orange-400',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const containerInfoVariants = cva(
  'relative mb-2.5 flex min-h-10 w-full cursor-pointer justify-between overflow-hidden rounded-xl p-3.5 shadow',
  {
    variants: {
      variant: {
        default: 'bg-white',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const bodyInfoVariants = cva('flex items-start text-sm font-medium', {
  variants: {
    variant: {
      default: 'text-slate-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export default function ToastProvider({ children }: ToastProviderProps) {
  return (
    <>
      {children}
      <ToastContainer
        containerId="alerts"
        className={'sm:!w-[430px]'}
        toastClassName={(context) => cn(containerAlertsVariants({ variant: context?.type }))}
        bodyClassName={(context) => cn(bodyAlertsVariants({ variant: context?.type }))}
        position="bottom-right"
        autoClose={false}
        hideProgressBar
        limit={3}
      />
      <ToastContainer
        containerId="info"
        className={'sm:!w-[440px]'}
        toastClassName={() => cn(containerInfoVariants())}
        bodyClassName={() => cn(bodyInfoVariants())}
        position="bottom-right"
        autoClose={false}
        hideProgressBar
      />
    </>
  );
}
