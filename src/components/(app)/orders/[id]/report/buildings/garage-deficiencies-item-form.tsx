'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';
import _pick from 'lodash/pick';

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
  GARAGE_DEFICIENCY_NAME,
  GARAGE_DEFICIENCY_TYPE,
  GARAGE_DEFICIENCY_DETAIL_FOUNDATION,
  GARAGE_DEFICIENCY_DETAIL_EXTERIOR_WALLS,
  GARAGE_DEFICIENCY_DETAIL_ROOF_SURFACE,
  GARAGE_DEFICIENCY_DETAIL_WINDOWS,
  GARAGE_DEFICIENCY_DETAIL_CEILING,
  GARAGE_DEFICIENCY_DETAIL_INTERIOR_WALLS,
} from '@/utils/api/schemas/constants';
import { TGarageDeficienciesItem, garageDeficienciesItemSchema } from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TGarageDeficienciesItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TGarageDeficienciesItem, path: string) => void;
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

const removeExtraFields = (data: TGarageDeficienciesItem) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.garageDeficiencyName === 'NONE_OBSERVED') {
    return { garageDeficiencyName: cleanedData.garageDeficiencyName };
  } else {
    if (cleanedData.garageDeficiencyName !== 'FOUNDATION') {
      delete cleanedData.garageDeficiencyDetailFoundation;
    }

    if (cleanedData.garageDeficiencyName !== 'EXTERIOR_WALLS') {
      delete cleanedData.garageDeficiencyDetailExteriorWalls;
    }

    if (cleanedData.garageDeficiencyName !== 'ROOF') {
      delete cleanedData.garageDeficiencyDetailRoofSurface;
    }

    if (cleanedData.garageDeficiencyName !== 'WINDOWS') {
      delete cleanedData.garageDeficiencyDetailWindows;
    }

    if (cleanedData.garageDeficiencyName !== 'CEILING') {
      delete cleanedData.garageDeficiencyDetailCeiling;
    }

    if (cleanedData.garageDeficiencyName !== 'INTERIOR_WALLS') {
      delete cleanedData.garageDeficiencyDetailInteriorWalls;
    }

    cleanedData.garageDeficiencySeverity = !!cleanedData.garageDeficiencySeverity;
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
  const form = useForm<TGarageDeficienciesItem>({
    resolver: zodResolver(garageDeficienciesItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<TGarageDeficienciesItem> = async (data) => {
    const cleanedData = removeExtraFields(data);

    onSave(cleanedData, path);
    onBackward();
    onNextStep(BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCIES);
  };

  const garageDeficiencyName = form.watch('garageDeficiencyName');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCY)}
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
              name="garageDeficiencyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garage Deficiency Name</FormLabel>
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
                        {GARAGE_DEFICIENCY_NAME.map((value) => (
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

            {garageDeficiencyName !== 'NONE_OBSERVED' && (
              <FormField
                control={form.control}
                name="garageDeficiencyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Type</FormLabel>
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
                          {GARAGE_DEFICIENCY_TYPE.map((value) => (
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

            {garageDeficiencyName === 'FOUNDATION' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailFoundation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detail Foundation</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_FOUNDATION.map((value) => (
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

            {garageDeficiencyName === 'EXTERIOR_WALLS' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailExteriorWalls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detail Exterior Walls</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_EXTERIOR_WALLS.map((value) => (
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

            {garageDeficiencyName === 'ROOF' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailRoofSurface"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detail Roof Surface</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_ROOF_SURFACE.map((value) => (
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

            {garageDeficiencyName === 'WINDOWS' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailWindows"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detial Windows</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_WINDOWS.map((value) => (
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

            {garageDeficiencyName === 'CEILING' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailCeiling"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detail Ceiling</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_CEILING.map((value) => (
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

            {garageDeficiencyName === 'INTERIOR_WALLS' && (
              <FormField
                control={form.control}
                name="garageDeficiencyDetailInteriorWalls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Garage Deficiency Detail Interior Walls</FormLabel>
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
                          {GARAGE_DEFICIENCY_DETAIL_INTERIOR_WALLS.map((value) => (
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

            {garageDeficiencyName !== 'NONE_OBSERVED' && (
              <>
                <FormField
                  control={form.control}
                  name="garageDeficiencySeverity"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Garage Deficiency Severity</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="garageDeficiencyDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garage Deficiency Description</FormLabel>
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
                  onNextStep(BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCIES);
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
