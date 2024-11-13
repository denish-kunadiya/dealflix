import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';
import { getStatus } from '@/utils/helper';
import { camelCase } from 'lodash';
import React from 'react';

const OrdersStatus = ({ order }: { order: Orders }) => {
  return (
    <div>
      <StatusBadge
        className={`ml-4 flex justify-center whitespace-nowrap`}
        variant={camelCase(order?.status) as StatusBadgeProps['variant']}
        size={'lg'}
      >
        {getStatus(order.status)}
      </StatusBadge>
    </div>
  );
};

export default OrdersStatus;
