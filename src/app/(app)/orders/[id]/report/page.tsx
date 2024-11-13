import { getOrderById } from '@/app/(app)/orders/[id]/actions';
import Report from '@/components/(app)/orders/[id]/report/report';

const ReportPage = async ({ params }: { params: { id: string } }) => {
  const res = await getOrderById(params.id);

  if (res.error) {
    console.error(res.error);
  }

  const order = res.data?.order || {};
  const report = order?.report?.[0] || {};

  return (
    <Report
      order={order}
      report={report}
    />
  );
};

export default ReportPage;
