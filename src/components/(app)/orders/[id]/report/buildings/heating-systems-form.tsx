'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';

import { notify } from '@/components/ui/toastify/toast';
import {
  heatingSystemsObjSchema,
  THeatingSystems,
  THeatingSystemsItem,
} from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
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

import ReportSectionHeader from '../report-section-header';
import { HEATING_TYPE } from '@/utils/api/schemas/constants';
import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';

type TData = THeatingSystems | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: THeatingSystems, path: string) => Promise<boolean>;
  onNextStep: (step: string) => void;
  onNextPath: (path: string) => void;
  onBackward: () => void;
  isPartiallyFilled?: boolean;
  isViewMode?: boolean;
}

const getFormDefaultValues = (data: TData) => {
  return {
    heatingSystems: data?.heatingSystems || [
      {
        heatingType: 'NO_HEAT',
      },
    ],
  };
};

const HeatingSystemsForm = ({
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
  const form = useForm<THeatingSystems>({
    resolver: zodResolver(heatingSystemsObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<THeatingSystems> = async (data) => {
    const isSuccess = await onSave(data, path);
    if (!isSuccess) {
      notify({
        title: 'Error',
        text: 'Failed to save. Please try again.',
        type: 'error',
      });
      return;
    }

    onBackward();
    onNextStep(BUILDINGS_INNER_SEGMENT.UNIT);
  };

  const controlBasePathName = 'heatingSystems';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const heatingSystems = form.watch(controlBasePathName);
  const isContainsNoHeat = heatingSystems.map((item) => item.heatingType).includes('NO_HEAT');

  const handleAddItem = async (index: number) => {
    fieldsArray.append({} as THeatingSystemsItem);
  };

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.HEATING_SYSTEMS)}
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
            {fieldsArray.fields.map((arrayItem, index) => {
              const isEmpty = Object.keys(arrayItem).length === 1; // including id
              const errorMessage = form.formState.errors?.heatingSystems?.[index]
                ? isEmpty
                  ? 'Required'
                  : 'Contains errors'
                : '';

              return (
                <FormField
                  key={arrayItem.id}
                  control={form.control}
                  name={`${controlBasePathName}.${index}.heatingType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Heating Type</FormLabel>
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
                            {HEATING_TYPE.map((value) => (
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
                          onClick={async (e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            if (fieldsArray.fields.length > 1) {
                              fieldsArray.remove(index);
                              if (form.formState.isDirty) {
                                await form.trigger();
                              }
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
              );
            })}

            {!isContainsNoHeat && (
              <div className="flex w-full items-center justify-center pt-5">
                <Button
                  variant="outline"
                  className="w-96"
                  disabled={isViewMode}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault();
                    handleAddItem(fieldsArray.fields.length);
                  }}
                >
                  <Icon
                    icon="plus"
                    size="sm"
                    className="mr-2.5"
                  />
                  Add Heating Type
                </Button>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.UNIT);
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

export default HeatingSystemsForm;
