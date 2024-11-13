import * as React from 'react';
import { cva } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const msgTitleVariants = cva('-ml-0.5 text-xs font-bold leading-normal', {
  variants: {
    variant: {
      default: 'ml-0 text-slate-700',
      success: 'text-slate-700',
      error: 'text-slate-700',
      info: 'text-slate-700',
      warning: 'text-slate-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const msgTextVariants = cva('-ml-0.5 text-xs font-normal leading-normal', {
  variants: {
    variant: {
      default: 'ml-0 text-slate-700',
      success: 'text-slate-700',
      error: 'text-slate-700',
      info: 'text-slate-700',
      warning: 'text-slate-700',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ToastMsgOptions {
  msgTitle?: string;
  msgText?: string;
}

interface AlerProps {
  toastProps?: any;
  closeToast?: () => void;
}

interface InfoProps extends AlerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export interface ToastMsgProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ToastMsgOptions,
    AlerProps {}

const AlertMsg = React.forwardRef<HTMLDivElement, ToastMsgProps>(
  ({ className, toastProps, closeToast, msgTitle, msgText, ...props }, ref) => {
    return (
      <div
        className={cn('flex flex-col gap-1', className)}
        ref={ref}
        {...props}
      >
        {msgTitle && (
          <div className={cn(msgTitleVariants({ variant: toastProps?.type }))}>{msgTitle}</div>
        )}
        {msgText && (
          <div className={cn(msgTextVariants({ variant: toastProps?.type }))}>{msgText}</div>
        )}
      </div>
    );
  },
);
AlertMsg.displayName = 'AlertMsg';

export interface InfoMsgProps
  extends React.HTMLAttributes<HTMLDivElement>,
    ToastMsgOptions,
    InfoProps {}

const InfoMsg = React.forwardRef<HTMLDivElement, InfoMsgProps>(
  (
    { className, toastProps, closeToast, msgTitle, msgText, onAccept, onDecline, ...props },
    ref,
  ) => {
    return (
      <div
        className={cn('flex items-start gap-2', className)}
        ref={ref}
        {...props}
      >
        <Icon
          size="sm"
          icon="information"
          className="text-sky-500"
        />
        <div className="flex flex-col gap-1">
          {msgTitle && (
            <div className={cn(msgTitleVariants({ variant: toastProps?.type }))}>{msgTitle}</div>
          )}
          {msgText && (
            <div className={cn(msgTextVariants({ variant: toastProps?.type }))}>{msgText}</div>
          )}

          <div
            className={cn(
              {
                'mt-[11px]': !!onAccept || !!onDecline,
              },
              'flex gap-4',
            )}
          >
            {!!onAccept && (
              <Button
                size="sm"
                className="min-w-32"
                onClick={closeToast}
              >
                Accept
              </Button>
            )}
            {!!onDecline && (
              <Button
                size="sm"
                variant="outline"
                className="min-w-32"
                onClick={closeToast}
              >
                Decline
              </Button>
            )}
          </div>
        </div>
        <Icon
          size="sm"
          icon="x"
          className="absolute right-2.5 top-2.5 h-[15px] min-h-[15px] w-[15px] min-w-[15px] cursor-pointer text-slate-400"
          onClick={closeToast}
        />
      </div>
    );
  },
);
InfoMsg.displayName = 'InfoMsg';

export { AlertMsg, InfoMsg };
