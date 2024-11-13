import { getOrderById } from '@/app/(app)/orders/[id]/actions';
import PropertyForm from '@/components/(app)/orders/[id]/report/property/property-form';

const PropertyPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrderById(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const order = res.data?.order || {};
  const report = order?.report[0] || {};

  return (
    <PropertyForm
      order={order}
      report={report}
    />
  );
};

export default PropertyPage;
