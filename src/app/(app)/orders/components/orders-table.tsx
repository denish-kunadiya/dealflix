'use client';
import React from 'react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';

interface IProps {
  orders: Orders[];
  handleBookAcceptOrder: (id: string, action: 'accept' | 'book') => void;
  handleRejectOrder: (id: string) => void;
}

const OrdersTable: React.FC<IProps> = ({ orders, handleBookAcceptOrder, handleRejectOrder }) => {
  return (
    <table className="min-w-full">
      <tbody className="divide-y ">
        {orders?.length > 0 &&
          orders
            ?.filter((item) => item.status === 'ASSIGNED')
            ?.map((item: Orders) => (
              <tr
                key={item.id}
                className="border-b"
              >
                <td className=" whitespace-nowrap py-4">
                  <div className="flex items-center">
                    <div className=" text-lg font-semibold text-slate-900">
                      {item?.street_address}
                    </div>
                    <StatusBadge
                      variant={'assigned'}
                      className="ml-4 flex h-[25px] w-[92px] items-center justify-center bg-purple-400 text-sm font-normal text-slate-50"
                    >
                      {item?.status}
                    </StatusBadge>
                  </div>
                  <div className="mt-2 text-sm font-normal text-slate-400">
                    {item?.city} · {item?.state} {item?.postal_code} · Created on{' '}
                    {format(parseISO(item.created_at), 'dd MMM yyyy')}
                  </div>
                </td>
                <td className="whitespace-nowrap py-4 pl-6 text-right text-sm font-medium">
                  <Button
                    size="sm"
                    className="mr-2.5 w-24"
                    variant={'ghost'}
                    onClick={() => handleRejectOrder(item.id)}
                  >
                    Reject
                  </Button>
                  <Button
                    size="sm"
                    className="w-24"
                    onClick={() => handleBookAcceptOrder(item.id, 'accept')}
                  >
                    Accept
                  </Button>
                </td>
              </tr>
            ))}
        {orders?.length > 0 &&
          orders
            ?.filter((item) => item.status === 'AVAILABLE')
            ?.map((item: Orders) => (
              <tr
                key={item.id}
                className="border-b"
              >
                <td className="whitespace-nowrap py-4 ">
                  <div className="flex items-center">
                    <div className="text-lg font-semibold text-slate-900">
                      {' '}
                      {item?.street_address}
                    </div>

                    <StatusBadge
                      variant={'assigned'}
                      className="ml-4 flex h-[25px] w-24 items-center justify-center bg-emerald-400 text-sm font-normal text-slate-50"
                    >
                      AVAILABLE
                    </StatusBadge>
                  </div>
                  <div className="mt-2 text-sm font-normal text-slate-400">
                    {item?.city} · {item?.state} {item?.postal_code} · Created on{' '}
                    {format(parseISO(item.created_at), 'MMMM d, yyyy')}
                  </div>
                </td>
                <td className="whitespace-nowrap py-4 pl-6 text-right text-sm font-medium">
                  <Button
                    size="sm"
                    className="w-24"
                    onClick={() => handleBookAcceptOrder(item.id, 'book')}
                  >
                    Book
                  </Button>
                </td>
              </tr>
            ))}
      </tbody>
    </table>
  );
};

export default OrdersTable;
