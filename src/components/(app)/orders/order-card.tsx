import camelCase from 'lodash/camelCase';
import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';

const OrderCard = ({ order }: { order: any }) => {
  const title = order.street_address;
  const description = `${order.city}, · ${order.state} ${order.postal_code} · ${order.floors_number} Floors`; // TODO add due date
  const orderStatus = order?.status;
  const orderStatusVariant = orderStatus && (camelCase(orderStatus) as StatusBadgeProps['variant']);

  return (
    <div className="flex items-center justify-between border-b border-slate-200 py-5">
      <div className="flex flex-col gap-3">
        <div className="flex gap-6">
          <p className="text-lg font-semibold text-slate-900">{title}</p>
          <StatusBadge variant={orderStatusVariant}>{order.status?.replace(/_/g, ' ')}</StatusBadge>
        </div>
        <p className="text-sm font-normal text-slate-400">{description}</p>
      </div>
      <div className="flex">
        <Button
          size="sm"
          className="w-24"
        >
          Book
        </Button>
      </div>
    </div>
  );
};

export default OrderCard;
