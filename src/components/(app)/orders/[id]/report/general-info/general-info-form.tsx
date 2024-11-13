'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { generalInfoSchema, TGeneralInfoSchema } from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import {
  COLLECTION_TYPES,
  CONTACT_METHODS,
  PROPERTY_DATA_COLLECTOR_TYPES,
} from '@/utils/api/schemas/constants';
import { PreventNavigation } from '@/components/ui/modals/prevent-navigation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import SectionBreadcrumb from '../../section-breadcrumb';
import ReportSectionHeader from '../report-section-header';

import { updateReportGenralInfo } from '@/app/(app)/orders/[id]/actions';
import { DrawerProvider } from '@/utils/hooks/use-navigation-drawer-context';

const getFormDefaultValues = (inspectionReport: any) => {
  return {
    collectionType: inspectionReport?.collectionType || COLLECTION_TYPES[0],
    caseFileID: inspectionReport?.caseFileID || '',
    lpaID: inspectionReport?.lpaID || '',
    pdaSubmitterEntity: inspectionReport?.pdaSubmitterEntity || '',
    propertyDataCollectorName: inspectionReport?.propertyDataCollectorName || '',
    pdaHyperLink: inspectionReport?.pdaHyperLink || '',
    propertyDataCollectorContacts: [
      {
        contactMethod:
          inspectionReport?.propertyDataCollectorContacts?.[0]?.contactMethod || CONTACT_METHODS[0],
        contactDetail: inspectionReport?.propertyDataCollectorContacts?.[0]?.contactDetail || '',
      },
    ],
    pdaCollectionEntity: inspectionReport?.pdaCollectionEntity || '',
    propertyDataCollectorType: inspectionReport?.propertyDataCollectorType || 'REAL_ESTATE_AGENT',
    dataCollectorAcknowledgement: inspectionReport?.dataCollectorAcknowledgement || false,
    dataCollectionDate: inspectionReport?.dataCollectionDate || '',
  };
};

interface IGeneralInfo {
  order: any;
  report: any;
}

const GeneralInfo = ({ order, report }: IGeneralInfo) => {
  const router = useRouter();
  const form = useForm<TGeneralInfoSchema>({
    resolver: zodResolver(generalInfoSchema),
    defaultValues: getFormDefaultValues(report.inspection_report),
  });

  const isStoredByGSE = !!report?.fnm_inspection_id;

  const onSubmit: SubmitHandler<TGeneralInfoSchema> = async (data) => {
    const reqPayload = {
      reportId: report.id,
      payload: data,
    };

    const result = await updateReportGenralInfo(reqPayload);

    if (result.success) {
      const nextUrl = `/orders/${order.id}/report/property`;
      form.reset();

      router.push(nextUrl);
      router.refresh();
      return;
    }

    if (result.error) {
      console.error(result.error);

      return;
    }
  };

  return (
    <>
      <DrawerProvider>
        <div className="mx-auto flex max-w-7xl flex-col items-center px-3 sm:px-6 lg:px-10">
          <div className="mb-[60px] w-full">
            <SectionBreadcrumb />
          </div>
          <div className="w-full max-w-[612px] flex-col items-center">
            <header className="mb-[60px]">
              <ReportSectionHeader
                title="General Info"
                description="Step 1"
                variant="general-info"
              />
            </header>
            <main className="flex flex-col">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-10"
                >
                  <FormField
                    control={form.control}
                    name="collectionType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isStoredByGSE}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {COLLECTION_TYPES.map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="caseFileID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case File ID</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lpaID"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>lpa ID</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pdaSubmitterEntity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDA Submitter Entity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pdaHyperLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDA Hyper Link</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyDataCollectorName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Data Collector Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormDescription
                    variant="main"
                    className="pt-5"
                  >
                    Property Data Collector Contact Information
                  </FormDescription>

                  <FormField
                    control={form.control}
                    name="propertyDataCollectorContacts.0.contactMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Method</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isStoredByGSE}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {CONTACT_METHODS.map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyDataCollectorContacts.0.contactDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Detail</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pdaCollectionEntity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PDA Collection Entity</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="Enter information..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="propertyDataCollectorType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Data Collector Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isStoredByGSE} // TODO: disable or after send test cases
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROPERTY_DATA_COLLECTOR_TYPES.map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dataCollectorAcknowledgement"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2.5 space-y-0">
                        <FormControl>
                          <Checkbox
                            disabled={isStoredByGSE}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Data Collector Acknowledgement</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dataCollectionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data Collection Date</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isStoredByGSE}
                            placeholder="YYYY-MM-DD"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
                    <Button
                      variant="ghost"
                      asChild
                      disabled={form.formState.isSubmitting}
                      className="flex-1 basis-48"
                    >
                      <Link href={`/orders/${order.id}/report`}>Return to Report</Link>
                    </Button>
                    <Button
                      disabled={form.formState.isSubmitting || isStoredByGSE}
                      type="submit"
                      className="flex-1 basis-48"
                    >
                      Next
                    </Button>
                  </div>
                </form>
              </Form>
            </main>
          </div>
        </div>
        {!isStoredByGSE && <PreventNavigation isDirty />}
      </DrawerProvider>
    </>
  );
};

export default GeneralInfo;
