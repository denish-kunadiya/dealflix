'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';
import _pick from 'lodash/pick';

import { notify } from '@/components/ui/toastify/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
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

import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';
import { GARAGE_TYPE } from '@/utils/api/schemas/constants';

import { TGaragesItem, garagesItemSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TGaragesItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TGaragesItem, path: string) => Promise<boolean>;
  onNextStep: (step: string) => void;
  onNextPath: (path: string) => void;
  onBackward: () => void;
  isPartiallyFilled?: boolean;
  isViewMode?: boolean;
}

const getFormDefaultValues = (data: TData) => {
  return {
    ...(data || {}),
  };
};

const removeExtraFields = (data: TGaragesItem) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.garageType === 'NONE') {
    return { garageType: cleanedData.garageType };
  }

  cleanedData.garageConversionIndicator = !!cleanedData.garageConversionIndicator;

  return cleanedData;
};

const GaragesItemForm = ({
  path,
  stepDescription,
  data,
  onSave,
  onNextStep,
  onNextPath,
  onBackward,
  isPartiallyFilled = false,
  isViewMode = false,
}: IProps) => {
  const form = useForm<TGaragesItem>({
    resolver: zodResolver(garagesItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const handleAddOrEditGarageDeficiencies = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.garageDeficiencies`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCIES);
  };

  const onSubmit: SubmitHandler<TGaragesItem> = async (data) => {
    const cleanedData = removeExtraFields(data);

    const isSuccess = await onSave(cleanedData, path);
    if (!isSuccess) {
      notify({
        title: 'Error',
        text: 'Failed to save. Please try again.',
        type: 'error',
      });
      return;
    }

    onBackward();
    onNextStep(BUILDINGS_INNER_SEGMENT.GARAGES);
  };

  const garageType = form.watch('garageType');
  const garageDeficiencies = form.watch('garageDeficiencies');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.GARAGE)}
          description={stepDescription}
          variant="buildings"
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
              name="garageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garage Type</FormLabel>
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
                        {GARAGE_TYPE.map((value) => (
                          <SelectItem
                            key={value}
                            value={value}
                          >
                            {value.replace(/_/g, ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {garageType !== 'NONE' && (
              <>
                <FormField
                  control={form.control}
                  name="garageSpaceCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garage Space Count</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isViewMode}
                          placeholder="Enter information..."
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="garageSpaceArea"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garage Space Area</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isViewMode}
                          placeholder="Enter information..."
                          {...field}
                          value={field.value ?? ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="garageConversionIndicator"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Garage Conversion Indicator</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormArrayControl
                  title={`Garage Deficiencies ${garageDeficiencies?.length ? `(${garageDeficiencies.length})` : ''}`}
                  errorMessage={form.formState?.errors?.garageDeficiencies ? 'Required' : ''}
                  description={garageDeficiencies?.length ? 'Edit information' : 'Add information'}
                  mode={garageDeficiencies?.length ? 'edit' : 'add'}
                  onAdd={() => handleAddOrEditGarageDeficiencies()}
                  onEdit={() => handleAddOrEditGarageDeficiencies()}
                />
              </>
            )}

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.GARAGES);
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

export default GaragesItemForm;
