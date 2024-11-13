'use client';

import { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SITE_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';
import { LOCATION_DESCRIPTION_TYPES } from '@/utils/api/schemas/constants';
import { TLocation, locationObjSchema } from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TLocation | undefined;

interface IProps {
  stepDescription: string;
  data: TData;
  onSave: (data: TLocation) => void;
  onNextStep: (step: string) => void;
  isViewMode?: boolean;
}

const getFormDefaultValues = (data: TData) => {
  return {
    location: {
      locations: data?.location?.locations || [
        {
          locationDescriptionType: 'OTHER_NEUTRAL',
          locationDescriptionDetails: '',
        },
      ],
    },
  };
};

const LocationsForm = ({
  stepDescription,
  data,
  onSave,
  onNextStep,
  isViewMode = false,
}: IProps) => {
  const form = useForm<TLocation>({
    resolver: zodResolver(locationObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const fieldsArray = useFieldArray({
    control: form.control,
    name: 'location.locations',
  });

  const onSubmit: SubmitHandler<TLocation> = async (data) => {
    onSave(data);
    onNextStep(SITE_INNER_SEGMENT.MAIN);
  };

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(SITE_INNER_SEGMENT.LOCATIONS)}
          description={stepDescription}
          variant="site"
        />
      </header>
      <main className="flex flex-col">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10"
          >
            {fieldsArray.fields.map((field, index) => (
              <Fragment key={field.id}>
                <FormField
                  control={form.control}
                  name={`location.locations.${index}.locationDescriptionType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Description Type</FormLabel>
                      <div className="flex w-full gap-x-2.5">
                        <Select
                          disabled={isViewMode}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select value..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {LOCATION_DESCRIPTION_TYPES.map((value) => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value.replace(/_/g, ' ')}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          className="flex-1 basis-9"
                          disabled={isViewMode}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            if (fieldsArray.fields.length > 1) {
                              fieldsArray.remove(index);
                            }
                          }}
                        >
                          -
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`location.locations.${index}.locationDescriptionDetails`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Description Details</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isViewMode}
                          placeholder="Enter information..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="border-b border-slate-200" />
              </Fragment>
            ))}

            <div className="flex w-full items-center justify-center pt-5">
              <Button
                variant="outline"
                className="w-96"
                disabled={isViewMode}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  fieldsArray.append({
                    locationDescriptionType: 'OTHER_NEUTRAL',
                    locationDescriptionDetails: '',
                  });
                }}
              >
                <Icon
                  icon="plus"
                  size="sm"
                  className="mr-2.5"
                />
                Add Location
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onNextStep(SITE_INNER_SEGMENT.MAIN);
                }}
              >
                Back
              </Button>
              <Button
                disabled={form.formState.isSubmitting || isViewMode}
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
  );
};

export default LocationsForm;
