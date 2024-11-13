'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { notify } from '@/components/ui/toastify/toast';
import {
  interiorDeficienciesObjSchema,
  TInteriorDeficiencies,
  TInteriorDeficienciesItem,
} from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Form } from '@/components/ui/form';
import FormArrayControl from '../form-array-control';

import ReportSectionHeader from '../report-section-header';

import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle, calcArrayItemTitle } from '@/utils/reports/helpers';

type TData = TInteriorDeficiencies | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TInteriorDeficiencies, path: string) => Promise<boolean>;
  onNextStep: (step: string) => void;
  onNextPath: (path: string) => void;
  onBackward: () => void;
  isPartiallyFilled?: boolean;
  isViewMode?: boolean;
}

const getFormDefaultValues = (data: TData) => {
  return {
    interiorDeficiencies: data?.interiorDeficiencies,
  };
};

const InteriorDeficienciesForm = ({
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
  const form = useForm<TInteriorDeficiencies>({
    resolver: zodResolver(interiorDeficienciesObjSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const onSubmit: SubmitHandler<TInteriorDeficiencies> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.ROOM);
  };

  const controlBasePathName = 'interiorDeficiencies';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const handleEditItem = async (index: number) => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.${index}`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCY);
  };

  const handleAddItem = async (index: number) => {
    fieldsArray.append({} as TInteriorDeficienciesItem);
    handleEditItem(index);
  };

  const handleRemoveItem = async (index: number) => {
    fieldsArray.remove(index);
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
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCIES)}
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
              const errorMessage = form.formState.errors?.[controlBasePathName]?.[index]
                ? isEmpty
                  ? 'Required'
                  : 'Contains errors'
                : '';

              return (
                <FormArrayControl
                  key={arrayItem.id}
                  title={`Interior Deficiency ${calcArrayItemTitle(arrayItem.interiorDeficiencyName)}`}
                  errorMessage={errorMessage}
                  description="Edit information"
                  mode={isViewMode ? 'edit' : 'edit-remove'}
                  onAdd={() => {
                    handleAddItem(fieldsArray.fields.length);
                  }}
                  onEdit={() => {
                    handleEditItem(index);
                  }}
                  onRemove={() => {
                    handleRemoveItem(index);
                  }}
                />
              );
            })}

            {fieldsArray.fields.length === 0 && (
              <FormArrayControl
                title="Interior Deficiency"
                errorMessage={form.formState.errors?.[controlBasePathName] ? 'Required' : ''}
                description="Add information"
                mode="add"
                onAdd={() => {
                  handleAddItem(0);
                }}
              />
            )}

            {!!fieldsArray.fields.length && (
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
                  Add Interior Deficiency
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

export default InteriorDeficienciesForm;
