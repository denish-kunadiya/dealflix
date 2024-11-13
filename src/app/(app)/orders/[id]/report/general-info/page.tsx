import { getOrderById } from '@/app/(app)/orders/[id]/actions';
import GeneralInfoForm from '@/components/(app)/orders/[id]/report/general-info/general-info-form';

const GeneralInfoPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrderById(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const order = res.data?.order || {};
  const report = order?.report[0] || {};

  return (
    <GeneralInfoForm
      order={order}
      report={report}
    />
  );
};

export default GeneralInfoPage;
