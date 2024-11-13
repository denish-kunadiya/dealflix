import { getOrdersInProgress } from '../actions';
import OrdersInProgress from '@/components/(app)/orders/orders-in-progress';

const OrdersInProgressPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrdersInProgress(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const orders = res.data?.orders || [];

  return <OrdersInProgress orders={orders} />;
};

export default OrdersInProgressPage;
