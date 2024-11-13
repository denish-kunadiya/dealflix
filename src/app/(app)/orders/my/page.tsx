'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { myOrders, rejectOrder, removeOrder } from '@/app/(app)/orders/actions';
import Spinner from '@/components/shared/spinner';
import NoRecordsFound from '@/components/shared/no-records-found';
import OrderHeader from '../components/headers/order-header';
import MyOrderTable from '../components/my-orders-table';
import { notify } from '@/components/ui/toastify/toast';

const MyOrders = () => {
  const [orders, setOrders] = useState<Orders[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<OrderFilter>({
    searchVal: '',
    activeTab: 'IN_PROGRESS',
  });

  const fetchMyOrders = useCallback(async (filter: OrderFilter) => {
    setLoading(true);
    const myorders = await myOrders(filter);
    setLoading(false);
    if (myorders.success) {
      setOrders(myorders.data);
    } else if (myorders.error) {
      notify({
        title: 'Error',
        text: 'Something went wrong.',
        type: 'error',
      });
    }
  }, []);

  useEffect(() => {
    fetchMyOrders(filter);
  }, [fetchMyOrders, filter]);

  const handleAbandonOrder = async (id: string) => {
    const data = await rejectOrder(id);
    if (data.error) {
      return notify({
        title: 'Error',
        text: 'Something went wrong.',
        type: 'error',
      });
    }

    const updatedOrders = await orders.filter((order: Orders) => {
      if (order.id !== id) {
        return order;
      }
    });
    setOrders(updatedOrders);
  };
  const handleRemoveOrder = async (id: string) => {
    // TODO: Refactor. Check it. The backend functionality is not implemented correctly. Therefore, this code is currently disabled.
    // const data = await removeOrder(id);
    // if (data.error) {
    //   return notify({
    //     title: 'Error',
    //     text: 'Something went wrong.',
    //     type: 'error',
    //   });
    // }
    // const updatedOrders = await orders.filter((order: Orders) => {
    //   if (order.id !== id) {
    //     return order;
    //   }
    // });
    // setOrders(updatedOrders);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <OrderHeader
          label="My orders"
          setFilter={setFilter}
        />
        <main>
          {loading && <Spinner />}
          {!orders?.length && <NoRecordsFound text="No Records Found" />}
          {orders.length > 0 && !loading && (
            <MyOrderTable
              orders={orders}
              handleAbandonOrder={handleAbandonOrder}
              handleRemoveOrder={handleRemoveOrder}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MyOrders;
