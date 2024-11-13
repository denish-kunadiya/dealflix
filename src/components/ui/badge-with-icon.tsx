import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/utils/cn';
import { Icon } from './icon';

const badgeWithIconVariants = cva(
  'flex items-center justify-center rounded-xl bg-transparent text-slate-50     ',
  {
    variants: {
      variant: {
        default: 'bg-sky-500',
        storage: ' bg-purple-400',
        report: 'bg-indigo-400',
        images: 'bg-rose-400',
        'general-info': 'bg-purple-400',
        property: 'bg-rose-400',
        site: 'bg-emerald-400',
        buildings: 'bg-blue-400',
      },
      size: {
        default: 'h-16 w-16 p-5',
        sm: 'h-12 w-12 p-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface BadgeWithIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeWithIconVariants> {}

function BadgeWithIcon({ className, variant, size, ...props }: BadgeWithIconProps) {
  return (
    <div
      className={cn(badgeWithIconVariants({ variant, size, className }))}
      {...props}
    >
      {variant === 'storage' && (
        <Icon
          variant="light"
          icon="folders"
        />
      )}
      {variant === 'report' && (
        <Icon
          variant="light"
          icon="briefcase"
        />
      )}
      {variant === 'images' && (
        <Icon
          variant="light"
          icon="camera"
        />
      )}
      {variant === 'general-info' && (
        <Icon
          variant="light"
          icon="information"
        />
      )}
      {variant === 'property' && (
        <Icon
          variant="light"
          icon="paste"
        />
      )}
      {variant === 'site' && (
        <Icon
          variant="light"
          icon="tree"
        />
      )}
      {variant === 'buildings' && (
        <Icon
          variant="light"
          icon="home"
        />
      )}
    </div>
  );
}

export { BadgeWithIcon, badgeWithIconVariants };
