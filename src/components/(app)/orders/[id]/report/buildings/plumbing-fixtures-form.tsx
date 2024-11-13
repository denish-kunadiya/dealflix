'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';

import {
  plumbingFixturesObjSchema,
  TPlumbingFixtures,
  TPlumbingFixturesItem,
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
import { FIXTURE_TYPE } from '@/utils/api/schemas/constants';
import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';

type TData = TPlumbingFixtures | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TPlumbingFixtures, path: string) => void;
  onNextStep: (step: string) => void;
  onNextPath: (path: string) => void;
  onBackward: () => void;
  isPartiallyFilled?: boolean;
  isViewMode?: boolean;
}

const getFormDefaultValues = (data: TData) => {
  return {
    plumbingFixtures: data?.plumbingFixtures || [
      {
        fixtureType: 'NONE_OBSERVED',
      },
    ],
  };
};

const PlumbingFixturesForm = ({
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
  const form = useForm<TPlumbingFixtures>({
    resolver: zodResolver(plumbingFixturesObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<TPlumbingFixtures> = async (data) => {
    onSave(data, path);
    onBackward();
    onNextStep(BUILDINGS_INNER_SEGMENT.ROOM);
  };

  const controlBasePathName = 'plumbingFixtures';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const plumbingFixtures = form.watch(controlBasePathName);
  const isContainsNone = plumbingFixtures
    ?.map((item) => item.fixtureType)
    .includes('NONE_OBSERVED');

  const handleAddItem = async (index: number) => {
    fieldsArray.append({} as TPlumbingFixturesItem);
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
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.PLUMBING_FIXTURES)}
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
              return (
                <FormField
                  key={arrayItem.id}
                  control={form.control}
                  name={`${controlBasePathName}.${index}.fixtureType`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fixture Type</FormLabel>
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
                            {FIXTURE_TYPE.map((value) => (
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

            {!isContainsNone && (
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
                  Add Fixture Type
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
                  onNextStep(BUILDINGS_INNER_SEGMENT.ROOM);
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

export default PlumbingFixturesForm;