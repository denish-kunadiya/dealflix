'use client';
import { useCallback, useEffect, useState } from 'react';
import Spinner from '@/components/shared/spinner';
import NoRecordsFound from '@/components/shared/no-records-found';
import OrderHeader from '@/components/(app)/admin/orders/order-header';
import AdminOrderTable from '@/components/(app)/admin/orders/order-table';
import {
  changeStatus,
  deleteAdminOrder,
  assign,
  updateAdminOrder,
  createAdminOrder,
  filterAdminOrder,
} from './action';
import { INITIAL_FORM_VALUES, ORDER_STATUS } from '@/utils/constants';
import AddOrderDrawer from '@/components/(app)/admin/orders/drawer/add-order-drawer';
import { notify } from '@/components/ui/toastify/toast';
import FilterOrderDrawer from '@/components/(app)/admin/orders/drawer/filter-order-drawer';

interface LatLong {
  latitude: number;
  longitude: number;
}

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isCreateEditOrder, setIsOpenCreateEditOrder] = useState<boolean>(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [editOrderData, setEditOrderData] = useState<OrderData | undefined>(undefined);
  const [filter, setFilter] = useState<FilterOrder>(INITIAL_FORM_VALUES);

  const fetchOrders = useCallback(async (filter: FilterOrder) => {
    setLoading(true);
    const data = await filterAdminOrder(filter);
    if (data.error) {
      setOrders([]);
      setLoading(false);
      return notify({
        title: 'Error',
        text: 'Error fetching orders.',
        type: 'error',
      });
    }
    if (data.success) {
      setOrders(data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders(filter);
  }, [fetchOrders, filter]);

  const updateOrderList = (id: string, status: string) => {
    const updatedOrders = orders.map((order: Orders) => {
      if (order.id === id) {
        return {
          ...order,
          status: status,
          assignee_id: null,
          last_updated: undefined,
        };
      }
      return order;
    });
    setOrders(updatedOrders);
  };

  const handleAssignOrder = async (orderId: string, user: AssignedUser) => {
    if (orderId && user.user_id) {
      const data = await assign(orderId, user.user_id);
      if (data.error) {
        notify({
          title: 'Error',
          text: 'Failed to assigned order.',
          type: 'error',
        });
      }
      if (data.success) {
        const updatedOrders = orders.map((order: Orders) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: ORDER_STATUS.ASSIGNED,
              assignee_id: user.user_id,
              assignee: {
                first_name: user.photographer.first_name,
                last_name: user.photographer.last_name,
                email: user.photographer.email,
                user_id: user.user_id,
              },
              last_updated: {
                // TODO: Find out why id is sometimes missing
                status: ORDER_STATUS.ASSIGNED,
                user_id: user.user_id,
                created_at: new Date().toString(),
              },
            };
          }
          return order;
        });
        setOrders(updatedOrders);
      }
    }
  };

  const handleInitiateAvailableOrder = async (
    assignee: string,
    type: 'available' | 'initiated',
  ) => {
    if (type === 'available') {
      const data = await changeStatus(assignee, ORDER_STATUS.AVAILABLE, null);
      if (data.error) {
        notify({
          title: 'Error',
          text: 'Something went wrong',
          type: 'error',
        });
        return;
      }
      if (data.success) {
        updateOrderList(assignee, ORDER_STATUS.AVAILABLE);
      }
    }
    if (type === 'initiated') {
      const data = await changeStatus(assignee, ORDER_STATUS.INITIATED, null);
      if (data.error) {
        notify({
          title: 'Error',
          text: 'Something went wrong',
          type: 'error',
        });
        return;
      }
      if (data.success) {
        updateOrderList(assignee, ORDER_STATUS.INITIATED);
      }
    }
  };

  const deleteOrder = async (id: string) => {
    if (!id.trim()) return;
    const data = await deleteAdminOrder(id);
    if (data.error) {
      notify({
        title: 'Error',
        text: 'Error fetching orders.',
        type: 'error',
      });
    }
    if (data.success) {
      const updatedOrders = orders.filter((order: Orders) => {
        return order.id !== id;
      });
      setOrders(updatedOrders);
    }
  };

  const createUpdateOrder = async (orderData: OrderData, location: LatLong) => {
    if (orderData.id) {
      const { data, error } = await updateAdminOrder(orderData, location);

      if (data) {
        setIsOpenCreateEditOrder(false);
        const orderValue = [...orders];
        const updatedOrders = orderValue.map((order) =>
          order.id === data.id
            ? {
                ...data,
                status: data.assignee_id ? ORDER_STATUS.ASSIGNED : data.status,
                assignee_id: data.assignee_id,
                assignee: orderData.assigned
                  ? {
                      first_name: orderData.assigned.first_name,
                      last_name: orderData.assigned.last_name,
                      user_id: orderData.assigned.user_id,
                      email: orderData.assigned.email,
                    }
                  : orderData.assignee,
                last_updated: {
                  id: orderData.last_updated?.id ?? null,
                  status: ORDER_STATUS.ASSIGNED,
                  user_id: orderData.assigned ? orderData.assigned.user_id : null,
                  created_at: new Date(),
                },
              }
            : order,
        );
        setOrders(updatedOrders);
        notify({
          title: 'Success',
          text: 'Order updated successfully created.',
          type: 'success',
        });
      } else {
        notify({
          title: 'Error',
          text: 'Something went wrong.',
          type: 'error',
        });
      }
      return { data, error };
    } else {
      const { data, error } = await createAdminOrder(orderData, location);
      if (data) {
        setIsOpenCreateEditOrder(false);
        setOrders([
          ...orders,
          {
            ...data,
            status: data.assignee_id ? ORDER_STATUS.ASSIGNED : data.status,
            assignee_id: data.assignee_id,
            ...(orderData.assigned && {
              assignee: {
                first_name: orderData.assigned.first_name,
                last_name: orderData.assigned.last_name,
                user_id: orderData.assigned.user_id,
                email: orderData.assigned.email,
              },
            }),
            last_updated: {
              status: ORDER_STATUS.ASSIGNED,
              user_id: orderData.assigned ? orderData.assigned.user_id : null,
              created_at: new Date(),
            },
          },
        ]);
        notify({
          title: 'Success',
          text: 'Order successfully created.',
          type: 'success',
        });
      } else {
        notify({
          title: 'Error',
          text: 'Something went wrong.',
          type: 'error',
        });
      }
      return { data, error };
    }
  };

  const handleReset = () => {
    setFilter(INITIAL_FORM_VALUES);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-[1360px] sm:px-6 lg:px-8">
        <OrderHeader
          label="Orders"
          filter={filter}
          handleReset={handleReset}
          handleFilterDrawerToggle={() => setIsFilterDrawerOpen(true)}
          setFilter={setFilter}
          handleDrawerToggle={() => {
            setEditOrderData(undefined);
            setIsOpenCreateEditOrder(true);
          }}
        />
        <main>
          {loading && <Spinner />}
          {!orders?.length && <NoRecordsFound text="No Records Found" />}

          {orders?.length > 0 && !loading && (
            <AdminOrderTable
              handleDrawerToggle={(data: OrderData) => {
                setEditOrderData(data);
                setIsOpenCreateEditOrder(true);
              }}
              orders={orders}
              handleInitiateAvailableOrder={handleInitiateAvailableOrder}
              deleteOrder={deleteOrder}
              handleAssignOrder={handleAssignOrder}
            />
          )}
          {isFilterDrawerOpen && (
            <FilterOrderDrawer
              filter={filter}
              setFilter={setFilter}
              isDrawerOpen={isFilterDrawerOpen}
              handleDrawerClose={() => setIsFilterDrawerOpen(false)}
              handleReset={handleReset}
            />
          )}
          {isCreateEditOrder && (
            <AddOrderDrawer
              editOrderData={editOrderData}
              createUpdateOrder={createUpdateOrder}
              handleDrawerClose={() => setIsOpenCreateEditOrder(false)}
              isDrawerOpen={isCreateEditOrder}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminOrdersPage;
