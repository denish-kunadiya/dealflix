'use client';

import ReportSectionCard, {
  IOrderSectionCardProps,
} from '@/components/(app)/orders/[id]/order-section-card';
import SectionHeader from '@/components/(app)/orders/[id]/section-header';
import OnsiteContactInfo from '@/components/(app)/orders/[id]/onsite-contact-info';

interface IReportSection extends Omit<IOrderSectionCardProps, 'reportId' | 'orderId'> {}

const Order = ({ order, report }: { order: any; report: any }) => {
  const reportSections: IReportSection[] = [
    {
      variant: 'storage',
      title: 'Image Reserve',
      description: 'Prepare in advance an archive of images for the report',
      nextSegment: 'image-reserve',
    },
    {
      variant: 'report',
      title: 'Property Report',
      description: 'Add the required property information',
      nextSegment: 'report',
      isDone: report?.fnm_inspection_id,
    },
    {
      variant: 'images',
      title: 'Property Images',
      description: 'Add the necessary property images',
      disabled: report?.fnm_inspection_id ? false : true,
      nextSegment: 'property-images',
    },
  ];

  const headerDescription = `${order.city}, ${order.state} ${order.postal_code}`;

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10">
      <SectionHeader
        title={order?.street_address}
        description={headerDescription}
        orderStatus={order?.status}
      >
        <OnsiteContactInfo
          name={order?.onsite_contact_name}
          phone={order?.onsite_contact_phone}
          email={order?.onsite_contact_email}
        />
      </SectionHeader>
      <main>
        <div className="flex flex-col gap-16">
          {reportSections.map((reportSection) => (
            <ReportSectionCard
              key={reportSection.variant}
              variant={reportSection.variant}
              reportId={report?.id}
              orderId={order?.id}
              title={reportSection.title}
              description={reportSection.description}
              disabled={reportSection.disabled}
              nextSegment={reportSection.nextSegment}
              isDone={reportSection.isDone}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Order;
