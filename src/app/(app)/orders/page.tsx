'use client';
import { useCallback, useEffect, useState } from 'react';
import OrdersTable from './components/orders-table';
import Spinner from '@/components/shared/spinner';
import NoRecordsFound from '@/components/shared/no-records-found';
import OrderHeader from './components/headers/order-header';
import { acceptOrder, bookOrder, getAllOrders, rejectOrder } from './actions';
import FilterDrawer from './components/filter-drawer';
import { notify } from '@/components/ui/toastify/toast';
import { AlertModal } from '@/components/ui/modals/alert-modal';

const OrdersPage = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [orderId, setOrderId] = useState<string>('');
  const [openAlertBox, setOpenAlertBox] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<OrderFilter>({
    searchVal: '',
    floor: 0,
    mile: 0,
    state: '',
  });
  const [showClear, setShowClear] = useState(false);

  useEffect(() => {
    setShowClear(!!(filter.mile || filter.floor || filter.state));
  }, [filter]);

  const fetchOrders = useCallback(async (filter: OrderFilter) => {
    setLoading(true);
    const data = await getAllOrders(filter);
    setLoading(false);
    if (data.success) {
      setOrders(data.data);
    } else if (data.error) {
      setOrders([]);
      console.error('Error fetching assigned orders:', data.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders(filter);
  }, [fetchOrders, filter]);

  const handleBookAcceptOrder = async (id: string, action: 'accept' | 'book') => {
    try {
      const data = action === 'accept' ? await acceptOrder(id) : await bookOrder(id);
      if (data && data.success) {
        const filteredOrders = orders.filter((item: Orders) => item.id !== id);
        setOrders(filteredOrders);
      }
      if (data && data.error) {
        if (action === 'book' && data.error.details) {
          setOpenAlertBox(true);
          setOrderId(id);
        } else {
          notify({
            title: 'Error',
            text: 'Something went wrong.',
            type: 'error',
          });
        }
      }
    } catch (error) {
      notify({
        title: 'Error',
        text: 'Something went wrong.',
        type: 'error',
      });
    }
  };

  const handleRejectOrder = async (id: string) => {
    const data = await rejectOrder(id);
    if (data.error) {
      return notify({
        title: 'Error',
        text: 'Error fetching orders.',
        type: 'error',
      });
    }

    const updatedOrders = await orders.map((order: Orders) => {
      if (order.id === id) {
        return {
          ...order,
          status: 'AVAILABLE',
          assignee_id: null,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const resetFilters = async () => {
    setFilter((prev: OrderFilter) => ({
      ...prev,
      floor: 0,
      mile: 0,
      state: '',
    }));
  };

  const handleClose = () => {
    const filteredOrders = orders.filter((item: Orders) => item.id !== orderId);
    setOrders(filteredOrders);
    setOpenAlertBox(false);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <OrderHeader
          label="Orders"
          handleDrawerToggle={() => setOpenDrawer(true)}
          resetFilters={resetFilters}
          displayClearFilter={showClear}
          setFilter={setFilter}
        />
        <main>
          {loading && <Spinner />}
          {!orders?.length && <NoRecordsFound text="No Records Found" />}

          {orders?.length > 0 && !loading && (
            <OrdersTable
              orders={orders}
              handleBookAcceptOrder={handleBookAcceptOrder}
              handleRejectOrder={handleRejectOrder}
            />
          )}

          <FilterDrawer
            handleDrawerClose={() => setOpenDrawer(false)}
            isDrawerOpen={openDrawer}
            setFilter={setFilter}
            filter={filter}
          />
        </main>
        {openAlertBox && (
          <AlertModal
            title=""
            description="Sorry,The order is already booked by another photographer."
            varinant="warning"
            mode="confirm"
            open={openAlertBox}
            onConfirm={handleClose}
            onCancel={handleClose}
          />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
