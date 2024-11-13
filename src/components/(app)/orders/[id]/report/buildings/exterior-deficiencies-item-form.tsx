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
  EXTERIOR_DEFICIENCY_NAMES,
  EXTERIOR_DEFICIENCY_TYPES,
  EXTERIOR_DEFICIENCY_DETAIL_FUNDATION,
  EXTERIOR_DEFICIENCY_DETAIL_EXTERIOR_WALLS,
  EXTERIOR_DEFICIENCY_DETAIL_ROOF_SURFACE,
  EXTERIOR_DEFICIENCY_DETAIL_GUTTERS_AND_DOWNSPUTS,
  EXTERIOR_DEFICIENCY_DETAIL_WINDOWS,
} from '@/utils/api/schemas/constants';
import {
  TExteriorDeficienciesItem,
  exteriorDeficienciesItemSchema,
} from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TExteriorDeficienciesItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TExteriorDeficienciesItem, path: string) => Promise<boolean>;
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

const removeExtraFields = (data: TExteriorDeficienciesItem) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.exteriorDeficiencyName === 'NONE_OBSERVED') {
    return { exteriorDeficiencyName: cleanedData.exteriorDeficiencyName };
  } else {
    if (cleanedData.exteriorDeficiencyName !== 'FOUNDATION') {
      delete cleanedData.exteriorDeficiencyDetailFoundation;
    }

    if (cleanedData.exteriorDeficiencyName !== 'EXTERIOR_WALLS') {
      delete cleanedData.exteriorDeficiencyDetailExteriorWalls;
    }

    if (cleanedData.exteriorDeficiencyName !== 'ROOF') {
      delete cleanedData.exteriorDeficiencyDetailRoofSurface;
    }

    if (cleanedData.exteriorDeficiencyName !== 'GUTTERS_DOWNSPOUTS') {
      delete cleanedData.exteriorDeficiencyDetailGuttersAndDownspouts;
    }

    if (cleanedData.exteriorDeficiencyName !== 'WINDOWS') {
      delete cleanedData.exteriorDeficiencyDetailWindows;
    }
  }

  return cleanedData;
};

const ExteriorDeficienciesItemForm = ({
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
  const form = useForm<TExteriorDeficienciesItem>({
    resolver: zodResolver(exteriorDeficienciesItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<TExteriorDeficienciesItem> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCIES);
  };

  const exteriorDeficiencyName = form.watch('exteriorDeficiencyName');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCY)}
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
              name="exteriorDeficiencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exterior Deficiency Name</FormLabel>
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
                        {EXTERIOR_DEFICIENCY_NAMES.map((value) => (
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

            {exteriorDeficiencyName !== 'NONE_OBSERVED' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Type</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_TYPES.map((value) => (
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

            {exteriorDeficiencyName === 'FOUNDATION' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyDetailFoundation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Detail Foundation</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_DETAIL_FUNDATION.map((value) => (
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

            {exteriorDeficiencyName === 'EXTERIOR_WALLS' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyDetailExteriorWalls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Detail Exterior Walls</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_DETAIL_EXTERIOR_WALLS.map((value) => (
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

            {exteriorDeficiencyName === 'ROOF' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyDetailRoofSurface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Detail Roof Surface</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_DETAIL_ROOF_SURFACE.map((value) => (
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

            {exteriorDeficiencyName === 'GUTTERS_DOWNSPOUTS' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyDetailGuttersAndDownspouts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Detail Gutters And Downspouts</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_DETAIL_GUTTERS_AND_DOWNSPUTS.map((value) => (
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

            {exteriorDeficiencyName === 'WINDOWS' && (
              <FormField
                control={form.control}
                name="exteriorDeficiencyDetailWindows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Exterior Deficiency Detial Windows</FormLabel>
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
                          {EXTERIOR_DEFICIENCY_DETAIL_WINDOWS.map((value) => (
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

            {exteriorDeficiencyName !== 'NONE_OBSERVED' && (
              <>
                <FormField
                  control={form.control}
                  name="exteriorDeficiencySeverity"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Exterior Deficiency Severity</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="exteriorDeficiencyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exterior Deficiency Description</FormLabel>
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
                  onNextStep(BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCIES);
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

export default ExteriorDeficienciesItemForm;
