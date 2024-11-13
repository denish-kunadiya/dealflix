import { getOrderById } from './actions';
import Order from '@/components/(app)/orders/[id]/order';

const OrderPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrderById(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const order = res.data?.order || {};
  const report = order?.report?.[0] || {};

  return (
    <Order
      order={order}
      report={report}
    />
  );
};

export default OrderPage;
