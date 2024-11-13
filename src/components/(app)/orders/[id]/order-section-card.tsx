'use client';
import { useRouter, usePathname } from 'next/navigation';
import { BadgeWithIcon, BadgeWithIconProps } from '@/components/ui/badge-with-icon';
import { Button } from '@/components/ui/button';
import { StatusBadgeLight } from '@/components/ui/status-badge';

export interface IOrderSectionCardProps {
  reportId: string;
  orderId: string;
  title: string;
  description: string;
  variant?: BadgeWithIconProps['variant'];
  disabled?: boolean;
  nextSegment?: string;
  isDone?: boolean;
}

const OrderSectionCard = ({
  description,
  title,
  variant,
  disabled,
  nextSegment,
  isDone = false,
}: IOrderSectionCardProps) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex gap-5">
      <div className="">
        <BadgeWithIcon variant={variant} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center gap-2.5">
          <p className="text-xl font-semibold text-slate-900">{title}</p>
          {isDone && (
            <StatusBadgeLight
              variant="available"
              size="sm"
            >
              Done
            </StatusBadgeLight>
          )}
        </div>
        <p className="line-clamp-2 text-base font-normal text-slate-400">{description}</p>
      </div>
      <div className="flex w-44 items-center">
        <Button
          size="sm"
          className="w-full"
          disabled={disabled}
          onClick={() => {
            router.push(`${pathname}/${nextSegment}`);
          }}
        >
          {isDone ? 'View' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default OrderSectionCard;
