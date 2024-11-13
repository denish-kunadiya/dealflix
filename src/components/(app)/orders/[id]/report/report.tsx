'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { notify } from '@/components/ui/toastify/toast';
import { Button } from '@/components/ui/button';
import SectionHeader from '../section-header';
import ReportSectionCard, { IReportSectionCardProps } from './report-section-card';

import { Icon } from '@/components/ui/icon';

import {
  generalInfoSchema,
  reportPropertySchema,
  reportSiteSchema,
  reportBuildingsSchema,
} from '@/utils/api/schemas/report';
import { sendIspectionReport } from '@/app/(app)/orders/[id]/actions';
import { DrawerProvider } from '@/utils/hooks/use-navigation-drawer-context';

interface IReportProps {
  order: any;
  report: any;
}

const Report = ({ order, report }: IReportProps) => {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const isGeneralInfoFilledOut = !!report?.inspection_report?.dataCollectionDate;
  const isPropertyFilledOut = !!report?.inspection_report?.property;
  const isSiteFilledOut = !!report?.inspection_report?.property?.site;
  const isBuildingsFilledOut = !!report?.inspection_report?.property?.buildings;

  const isGeneralInfoValid = generalInfoSchema.safeParse(report?.inspection_report).success;
  const isPropertyValid = reportPropertySchema.safeParse(
    report?.inspection_report?.property,
  ).success;
  const isSiteValid = reportSiteSchema.safeParse(report?.inspection_report?.property?.site).success;
  const isBuildingsValid = reportBuildingsSchema.safeParse(
    report?.inspection_report?.property?.buildings,
  ).success;

  const isStoredByGSE = !!report?.fnm_inspection_id;
  const isReadyToSubmit =
    !isStoredByGSE && isGeneralInfoValid && isPropertyValid && isSiteValid && isBuildingsValid;

  const reportSections: IReportSectionCardProps[] = [
    {
      variant: 'general-info',
      title: 'General Info',
      description: 'Step 1',
      nextSegment: 'general-info',
      isFilledOut: isGeneralInfoFilledOut,
      isValid: isGeneralInfoValid,
    },
    {
      variant: 'property',
      title: 'Property',
      description: 'Step 2',
      nextSegment: 'property',
      isFilledOut: isPropertyFilledOut,
      isValid: isPropertyValid,
    },
    {
      variant: 'site',
      title: 'Site',
      description: 'Step 3',
      nextSegment: 'site',
      isFilledOut: isSiteFilledOut,
      isValid: isSiteValid,
    },
    {
      variant: 'buildings',
      title: 'Buildings',
      description: 'Step 4',
      nextSegment: 'buildings',
      isFilledOut: isBuildingsFilledOut,
      isValid: isBuildingsValid,
    },
  ];

  const handleSubmitReport = async () => {
    try {
      setIsPending(true);
      const result = await sendIspectionReport(report.id);

      if (result?.success) {
        const nextUrl = `/orders/${order.id}`;

        router.push(nextUrl);
        router.refresh();
        return;
      }

      notify({
        title: 'Error',
        text: 'Failed to save. Please try again.',
        type: 'error',
      });
    } catch (error) {
      notify({
        title: 'Error',
        text: 'Failed to save. Please try again.',
        type: 'error',
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10">
      <DrawerProvider>
        <SectionHeader
          title="Property Report"
          description="Add the required property information"
        >
          <div className="flex w-64 items-center">
            <Button
              className="w-full space-x-2.5"
              disabled={!isReadyToSubmit || isPending}
              onClick={handleSubmitReport}
            >
              <Icon
                icon="double-check"
                size="sm"
              />
              <span>{isPending ? 'Submitting...' : 'Submit Report'}</span>
            </Button>
          </div>
        </SectionHeader>
        <main className="flex flex-wrap items-center justify-between gap-10">
          {reportSections.map((reportSection, index) => {
            const isDisabled = index ? !reportSections[index - 1].isFilledOut : false;
            return (
              <ReportSectionCard
                key={reportSection.title}
                disabled={isDisabled}
                variant={reportSection.variant}
                title={reportSection.title}
                description={reportSection.description}
                nextSegment={reportSection.nextSegment}
                isFilledOut={reportSection.isFilledOut}
                isValid={reportSection.isValid}
                isStoredByGSE={isStoredByGSE}
              />
            );
          })}
        </main>
      </DrawerProvider>
    </div>
  );
};

export default Report;
