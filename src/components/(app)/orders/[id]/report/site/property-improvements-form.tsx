'use client';

import { Fragment } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import lodashCloneDeep from 'lodash/cloneDeep';

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
import { PROPERTY_IMPROVEMENT_TYPES } from '@/utils/api/schemas/constants';
import { TPropertyImprovements, propertyImprovementsObjSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TPropertyImprovements | undefined;

interface IProps {
  stepDescription: string;
  data: TData;
  onSave: (data: TPropertyImprovements, index?: number) => void;
  onNextStep: (step: string) => void;
  isViewMode?: boolean;
}

const INITIAL_OBJECT_ITEM = {
  propertyImprovementType: 'NONE',
  propertyImprovementDescription: '',
} as TPropertyImprovements['propertyImprovements'][0];

const getFormDefaultValues = (data: TData) => {
  return {
    propertyImprovements: data?.propertyImprovements || [
      {
        ...INITIAL_OBJECT_ITEM,
      },
    ],
  };
};

const PropertyImprovementsForm = ({
  stepDescription,
  data,
  onSave,
  onNextStep,
  isViewMode = false,
}: IProps) => {
  const form = useForm<TPropertyImprovements>({
    resolver: zodResolver(propertyImprovementsObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const controlBasePathName = 'propertyImprovements';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const handleAddOrEditIngroundPoolConcern = async (index: number) => {
    await form.trigger();
    onSave(form.getValues(), index);
    onNextStep(SITE_INNER_SEGMENT.INGROUND_POOL_CONCERNS);
  };

  const handleRemoveIngroundPoolConcern = async (index: number) => {
    const clonnedData = lodashCloneDeep(form.getValues());
    delete clonnedData.propertyImprovements[index].ingroundPoolConcerns;
    fieldsArray.update(index, {
      ...clonnedData.propertyImprovements[index],
    });
  };

  const onSubmit: SubmitHandler<TPropertyImprovements> = async (data) => {
    onSave(data);
    onNextStep(SITE_INNER_SEGMENT.MAIN);
  };

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(SITE_INNER_SEGMENT.PROPERTY_IMPROVEMENTS)}
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
            {fieldsArray.fields.map((field, index) => {
              const isIngroundPoolConcernsNotValid =
                !!form?.formState?.errors.propertyImprovements &&
                !!form?.formState?.errors.propertyImprovements[index] &&
                !!form?.formState?.errors.propertyImprovements[index]?.ingroundPoolConcerns;
              const propertyImprovementTypeValue = form.watch(
                `propertyImprovements.${index}.propertyImprovementType`,
              );
              const ingroundPoolConcerns = form.watch(
                `propertyImprovements.${index}.ingroundPoolConcerns`,
              );

              const ingroundPoolConcernsErrorMessage = isIngroundPoolConcernsNotValid
                ? !!ingroundPoolConcerns
                  ? 'Сontains errors'
                  : 'Required'
                : '';

              return (
                <Fragment key={field.id}>
                  <FormField
                    control={form.control}
                    name={`${controlBasePathName}.${index}.propertyImprovementType`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Improvement Type</FormLabel>
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
                              {PROPERTY_IMPROVEMENT_TYPES.map((value) => (
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

                  {propertyImprovementTypeValue !== 'NONE' && (
                    <FormField
                      control={form.control}
                      name={`${controlBasePathName}.${index}.propertyImprovementDescription`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Property Improvement Description</FormLabel>
                            <FormControl>
                              <Input
                                disabled={isViewMode}
                                placeholder="Enter information..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  )}

                  {propertyImprovementTypeValue === 'INGROUND_POOL' && (
                    <FormArrayControl
                      title="Inground Pool Concerns"
                      errorMessage={ingroundPoolConcernsErrorMessage}
                      description={
                        ingroundPoolConcerns?.length ? 'Edit information' : 'Add information'
                      }
                      mode={
                        ingroundPoolConcerns?.length ? (!!index ? 'edit-remove' : 'edit') : 'add'
                      }
                      onAdd={() => handleAddOrEditIngroundPoolConcern(index)}
                      onEdit={() => handleAddOrEditIngroundPoolConcern(index)}
                      onRemove={() => handleRemoveIngroundPoolConcern(index)}
                    />
                  )}

                  <div className="border-b border-slate-200" />
                </Fragment>
              );
            })}

            <div className="flex w-full items-center justify-center pt-5">
              <Button
                variant="outline"
                className="w-96"
                disabled={isViewMode}
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  fieldsArray.append({
                    ...INITIAL_OBJECT_ITEM,
                  });
                }}
              >
                <Icon
                  icon="plus"
                  size="sm"
                  className="mr-2.5"
                />
                Add
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

export default PropertyImprovementsForm;
