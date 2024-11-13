'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reportPropertySchema, TReportPropertySchema } from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

import { PROPERTY_TYPES } from '@/utils/api/schemas/constants';

import { updateReportProperty } from '@/app/(app)/orders/[id]/actions';
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
import { DrawerProvider } from '@/utils/hooks/use-navigation-drawer-context';

const getFormDefaultValues = (data: any) => {
  return {
    propertyType: data?.propertyType || PROPERTY_TYPES[0],
    propertyOccupied: data?.propertyOccupied || false,
    address: {
      streetAddress: data?.address?.streetAddress || '',
      unitNumber: data?.address?.unitNumber || '',
      city: data?.address?.city || '',
      county: data?.address?.county || '',
      state: data?.address?.state || '',
      postalCode: data?.address?.postalCode || '',
    },
    identification: {
      gpsCoordinates: {
        latitude: data?.identification?.gpsCoordinates?.latitude || '',
        longitude: data?.identification?.gpsCoordinates?.longitude || '',
      },
    },
  };
};

interface IPropertyForm {
  order: any;
  report: any;
}

const PropertyForm = ({ order, report }: IPropertyForm) => {
  const router = useRouter();
  const form = useForm<TReportPropertySchema>({
    resolver: zodResolver(reportPropertySchema),
    defaultValues: getFormDefaultValues(report?.inspection_report?.property),
  });

  const isStoredByGSE = !!report?.fnm_inspection_id;

  const onSubmit: SubmitHandler<TReportPropertySchema> = async (data) => {
    const reqPayload = {
      reportId: report.id,
      payload: data,
    };

    const result = await updateReportProperty(reqPayload);

    if (result.success) {
      const nextUrl = `/orders/${order.id}/report/site`;
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
                title="Property"
                description="Step 2"
                variant="property"
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
                    name="propertyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Collection Type</FormLabel>
                        <Select
                          disabled={isStoredByGSE}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PROPERTY_TYPES.map((value) => (
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
                    name="propertyOccupied"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2.5 space-y-0">
                        <FormControl>
                          <Checkbox
                            disabled={isStoredByGSE}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Property Occupied</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormDescription
                    variant="main"
                    className="pt-5"
                  >
                    Address
                  </FormDescription>

                  <FormField
                    control={form.control}
                    name="address.streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
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
                    name="address.unitNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Number</FormLabel>
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
                    name="address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
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
                    name="address.county"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>County</FormLabel>
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
                    name="address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
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
                    name="address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
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
                    GPS Coordinates
                  </FormDescription>

                  <FormField
                    control={form.control}
                    name="identification.gpsCoordinates.latitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Latitude</FormLabel>
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
                    name="identification.gpsCoordinates.longitude"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitude</FormLabel>
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

export default PropertyForm;
