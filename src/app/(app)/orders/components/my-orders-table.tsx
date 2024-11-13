import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';
import _camelCase from 'lodash/camelCase';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import CancelOrderDropdown from './cancel-order-dropdown';
import { StatusBadge, StatusBadgeProps } from '@/components/ui/status-badge';
import { notify } from '@/components/ui/toastify/toast';
import { getOrCreateReportForOrder } from '@/app/(app)/orders/[id]/actions';
import { formatPhoneNumber } from '@/utils/helper';
import OrderActionDialog from './order-action-dialog';
import { ORDER_STATUS } from '@/utils/constants';

interface IProps {
  orders: Orders[];
  handleAbandonOrder: (id: string) => void;
  handleRemoveOrder: (id: string) => void;
}

const MyOrderTable: React.FC<IProps> = ({ orders, handleAbandonOrder, handleRemoveOrder }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [action, setAction] = useState<'abandon' | 'remove'>();
  const [selectedOrder, setSelectedOrder] = useState<Orders | null>(null);
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleAction = (item: Orders, action: 'abandon' | 'remove') => {
    setAction(action);
    setSelectedOrder(item);
    setOpenModal(true);
  };

  const handleOpenOrderReport = async (orderId: string) => {
    try {
      setIsPending(true);
      const result = await getOrCreateReportForOrder(orderId);

      if (result.success) {
        const nextUrl = `/orders/${orderId}`;

        router.push(nextUrl);
        router.refresh();
        return;
      }

      if (result.error) {
        notify({
          title: 'Error',
          text: 'Something went wrong. Please try again.',
          type: 'error',
        });

        return;
      }
    } catch (error) {
      notify({
        title: 'Error',
        text: 'Something went wrong. Please try again.',
        type: 'error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <table className="min-w-full ">
        <thead>
          <tr className="">
            <th className="max-w-[210px] py-2 text-left text-[13px] font-semibold text-slate-900">
              Address
            </th>
            <th className="py-2 text-left text-[13px] font-semibold text-slate-900">Proprietor</th>
            <th className="py-2 text-left text-[13px] font-semibold text-slate-900">Updates</th>
            <th className="py-2 text-left text-[13px] font-semibold text-slate-900">Status</th>
            <th className="py-2 text-left text-[13px] font-semibold text-slate-900"></th>
          </tr>
        </thead>
        <tbody>
          {orders?.length &&
            orders?.map((item: Orders) => (
              <tr
                key={item.id}
                className="border-t"
              >
                <td className="py-4">
                  <div
                    className={`mb-4 font-semibold text-slate-900 ${item.status === 'COMPLETE' ? 'text-lg' : 'text-base'}`}
                  >
                    {item.street_address}
                  </div>
                  <div className="mt-2 text-sm font-normal text-slate-400">
                    {item.city} · {item.state} {item.postal_code}
                  </div>
                </td>
                <td className="py-4">
                  <div className="">
                    <div className="">
                      <div className="mb-4 mt-2 flex items-center justify-start text-xs text-slate-400">
                        <Icon
                          icon="user"
                          size="sm"
                          className="me-2.5"
                        />
                        <span className="text-sm font-normal">{item.onsite_contact_name}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-start text-xs ">
                        <Icon
                          icon="call"
                          size="sm"
                          className="me-2.5 text-slate-400"
                        />
                        <span className="text-sm font-normal text-sky-500">
                          {item?.onsite_contact_phone &&
                            formatPhoneNumber(item.onsite_contact_phone)}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <div className="mb-4 mt-2 flex items-center text-xs text-slate-400">
                    <Icon
                      icon="calendar"
                      size="sm"
                      className="me-2.5 text-slate-400"
                    />
                    <span className="text-sm font-normal">
                      {' '}
                      Creation date: {format(parseISO(item.created_at), 'dd MMM yyyy')}
                    </span>
                  </div>

                  {item.last_updated?.user_id &&
                    item.last_updated.status &&
                    ![
                      ORDER_STATUS.AVAILABLE,
                      ORDER_STATUS.INITIATED,
                      ORDER_STATUS.ASSIGNED,
                    ].includes(item.last_updated.status) && (
                      <div className="mb-4 mt-2 flex items-center text-xs text-slate-400">
                        <Icon
                          icon="flag"
                          size="sm"
                          className="me-2.5"
                        />
                        <span className="text-sm font-normal">
                          {' '}
                          {item.last_updated.status === ORDER_STATUS.IN_PROGRESS
                            ? 'Taken into work'
                            : item.last_updated.status === ORDER_STATUS.GSE_SUBMITTED
                              ? 'Submitted'
                              : item.last_updated.status === ORDER_STATUS.GSE_ACCEPTED
                                ? 'Accepted'
                                : item.last_updated.status === ORDER_STATUS.GSE_REJECTED
                                  ? 'Rejected'
                                  : item.last_updated.status === ORDER_STATUS.COMPLETE
                                    ? 'Closed'
                                    : ''}
                          : {format(item.last_updated.created_at, 'dd MMM yyyy')}
                        </span>
                      </div>
                    )}
                </td>
                <td className="py-4">
                  <StatusBadge
                    size="lg"
                    variant={_camelCase(item?.status) as StatusBadgeProps['variant']}
                    className={`flex justify-center ${item.status !== 'COMPLETE' ? 'w-[116px]' : 'w-[97px]'}`}
                  >
                    {item.status?.replace(/_/g, ' ')}
                  </StatusBadge>
                </td>
                <td className="py-4 text-end">
                  <div className="flex justify-end">
                    {item.status === 'IN_PROGRESS' ? (
                      <div className="flex items-center">
                        <Button
                          disabled={isPending}
                          size="sm"
                          className="me-5 min-w-24"
                          onClick={() => handleOpenOrderReport(item.id)}
                        >
                          Fill Out
                        </Button>
                        <CancelOrderDropdown
                          item={item}
                          handleAction={handleAction}
                          type="abandon"
                        />
                      </div>
                    ) : (
                      <>
                        <CancelOrderDropdown
                          item={item}
                          handleAction={handleAction}
                          type="remove"
                        />
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {openModal && action && (
        <OrderActionDialog
          open={openModal}
          handleClose={() => setOpenModal(!openModal)}
          action={action}
          selectedOrder={selectedOrder}
          handleAbandonOrder={handleAbandonOrder}
          handleRemoveOrder={handleRemoveOrder}
        />
      )}
    </>
  );
};

export default MyOrderTable;
