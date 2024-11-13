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
import {
  INTERIOR_DEFICIENCY_NAME,
  INTERIOR_DEFICIENCY_TYPE,
  INTERIOR_DEFICIENCY_DETAIL_FLOORING,
  INTERIOR_DEFICIENCY_DETAIL_CEILING,
  INTERIOR_DEFICIENCY_DETAIL_WALLS,
} from '@/utils/api/schemas/constants';
import {
  TInteriorDeficienciesItem,
  interiorDeficienciesItemSchema,
} from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TInteriorDeficienciesItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TInteriorDeficienciesItem, path: string) => Promise<boolean>;
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

const removeExtraFields = (data: TInteriorDeficienciesItem) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.interiorDeficiencyName === 'NONE_OBSERVED') {
    return { interiorDeficiencyName: cleanedData.interiorDeficiencyName };
  } else {
    cleanedData.interiorDeficiencySeverity = !!cleanedData.interiorDeficiencySeverity;
    cleanedData.interiorDeficiencyDetailTubShowerSurround =
      !!cleanedData.interiorDeficiencyDetailTubShowerSurround;

    if (cleanedData.interiorDeficiencyName !== 'FLOORING') {
      delete cleanedData.interiorDeficiencyDetailFlooring;
    }

    if (cleanedData.interiorDeficiencyName !== 'CEILING') {
      delete cleanedData.interiorDeficiencyDetailCeiling;
    }

    if (cleanedData.interiorDeficiencyName !== 'WALLS') {
      delete cleanedData.interiorDeficiencyDetailWalls;
    }

    if (cleanedData.interiorDeficiencyName !== 'SHOWER_TUB_SURROUND') {
      delete cleanedData.interiorDeficiencyDetailTubShowerSurround;
    }
  }

  return cleanedData;
};

const InteriorDeficienciesItemForm = ({
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
  const form = useForm<TInteriorDeficienciesItem>({
    resolver: zodResolver(interiorDeficienciesItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<TInteriorDeficienciesItem> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCIES);
  };

  const interiorDeficiencyName = form.watch('interiorDeficiencyName');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCY)}
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
              name="interiorDeficiencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interior Deficiency Name</FormLabel>
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
                        {INTERIOR_DEFICIENCY_NAME.map((value) => (
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

            {interiorDeficiencyName !== 'NONE_OBSERVED' && (
              <FormField
                control={form.control}
                name="interiorDeficiencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interior Deficiency Type</FormLabel>
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
                          {INTERIOR_DEFICIENCY_TYPE.map((value) => (
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
            )}

            {interiorDeficiencyName === 'FLOORING' && (
              <FormField
                control={form.control}
                name="interiorDeficiencyDetailFlooring"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interior Deficiency Detail Flooring</FormLabel>
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
                          {INTERIOR_DEFICIENCY_DETAIL_FLOORING.map((value) => (
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
            )}

            {interiorDeficiencyName === 'CEILING' && (
              <FormField
                control={form.control}
                name="interiorDeficiencyDetailCeiling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interior Deficiency Detail Ceiling</FormLabel>
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
                          {INTERIOR_DEFICIENCY_DETAIL_CEILING.map((value) => (
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
            )}

            {interiorDeficiencyName === 'WALLS' && (
              <FormField
                control={form.control}
                name="interiorDeficiencyDetailWalls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Interior Deficiency Detail Walls</FormLabel>
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
                          {INTERIOR_DEFICIENCY_DETAIL_WALLS.map((value) => (
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
            )}

            {interiorDeficiencyName === 'SHOWER_TUB_SURROUND' && (
              <FormField
                control={form.control}
                name="interiorDeficiencyDetailTubShowerSurround"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2.5 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled={isViewMode}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Interior Deficiency Detail Tub Shower Surround</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {interiorDeficiencyName !== 'NONE_OBSERVED' && (
              <>
                <FormField
                  control={form.control}
                  name="interiorDeficiencySeverity"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Interior Deficiency Severity</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="interiorDeficiencyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interior Deficiency Description</FormLabel>
                      <FormControl>
                        <Input
                          disabled={isViewMode}
                          placeholder="Enter information..."
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
                  onNextStep(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCIES);
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

export default InteriorDeficienciesItemForm;
