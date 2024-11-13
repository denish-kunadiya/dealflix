import camelCase from 'lodash/camelCase';

import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';

export interface ISectionTitleProps {
  title: string;
  description?: string;
  orderStatus?: TOrderStatus;
}

const SectionTitle = ({ title, description, orderStatus }: ISectionTitleProps) => {
  const orderStatusVariant = orderStatus && (camelCase(orderStatus) as StatusBadgeProps['variant']);

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        {orderStatus && (
          <StatusBadge
            variant={orderStatusVariant}
            size="sm"
          >
            {orderStatus.replace(/_/g, ' ')}
          </StatusBadge>
        )}
      </div>
      <p className="gap-4 text-lg font-normal text-slate-400">{description}</p>
    </div>
  );
};

export default SectionTitle;
