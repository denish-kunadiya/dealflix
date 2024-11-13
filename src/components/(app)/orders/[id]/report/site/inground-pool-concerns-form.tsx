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
import { POOL_CONCERN_TYPES } from '@/utils/api/schemas/constants';
import {
  ingroundPoolConcernsObjSchema,
  TIngroundPoolConcernsObjSchema,
} from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TIngroundPoolConcernsObjSchema | undefined;

interface IProps {
  stepDescription: string;
  data: TData;
  onSave: (data: TIngroundPoolConcernsObjSchema) => void;
  onNextStep: (step: string) => void;
  isViewMode?: boolean;
}

const INITIAL_OBJECT_ITEM = {
  ingroundPoolConcern: 'NONE',
  ingroundPoolConcernDescription: '',
} as TIngroundPoolConcernsObjSchema['ingroundPoolConcerns'][0];

const getFormDefaultValues = (data: TData) => {
  return {
    ingroundPoolConcerns: data?.ingroundPoolConcerns || [
      {
        ...INITIAL_OBJECT_ITEM,
      },
    ],
  };
};

const IngroundPoolConcernsForm = ({
  stepDescription,
  data,
  onSave,
  onNextStep,
  isViewMode = false,
}: IProps) => {
  const form = useForm<TIngroundPoolConcernsObjSchema>({
    resolver: zodResolver(ingroundPoolConcernsObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const controlBasePathName = 'ingroundPoolConcerns';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const onSubmit: SubmitHandler<TIngroundPoolConcernsObjSchema> = async (data) => {
    onSave(data);
    onNextStep(SITE_INNER_SEGMENT.PROPERTY_IMPROVEMENTS);
  };

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(SITE_INNER_SEGMENT.INGROUND_POOL_CONCERNS)}
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
              const ingroundPoolConcernValue = form.watch(
                `${controlBasePathName}.${index}.ingroundPoolConcern`,
              );
              return (
                <Fragment key={field.id}>
                  <FormField
                    control={form.control}
                    name={`${controlBasePathName}.${index}.ingroundPoolConcern`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inground Pool Concern</FormLabel>
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
                              {POOL_CONCERN_TYPES.map((value) => (
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
                  {ingroundPoolConcernValue !== 'NONE' && (
                    <FormField
                      control={form.control}
                      name={`${controlBasePathName}.${index}.ingroundPoolConcernDescription`}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <FormLabel>Inground Pool Concern Description</FormLabel>
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
                disabled={form.formState.isSubmitting}
                type="submit"
                className="flex-1 basis-48"
              >
                Back
              </Button>
            </div>
          </form>
        </Form>
      </main>
    </div>
  );
};

export default IngroundPoolConcernsForm;
