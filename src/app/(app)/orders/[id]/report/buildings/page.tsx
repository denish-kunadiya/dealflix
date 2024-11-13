import { getOrderById } from '@/app/(app)/orders/[id]/actions';
import BuildingsForm from '@/components/(app)/orders/[id]/report/buildings/buildings-form';

const BuildingsPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrderById(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const order = res.data?.order || {};
  const report = order?.report[0] || {};

  return (
    <BuildingsForm
      order={order}
      report={report}
    />
  );
};

export default BuildingsPage;
