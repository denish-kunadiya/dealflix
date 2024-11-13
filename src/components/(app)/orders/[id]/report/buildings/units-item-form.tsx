'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';
import _pick from 'lodash/pick';

import { notify } from '@/components/ui/toastify/toast';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';

import { TUnitsItem, unitsItemSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TUnitsItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TUnitsItem, path: string) => Promise<boolean>;
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

const UnitsItemForm = ({
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
  const form = useForm<TUnitsItem>({
    resolver: zodResolver(unitsItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const handleAddOrEditHeatingSystems = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.heatingSystems`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.HEATING_SYSTEMS);
  };

  const handleAddOrEditCoolingSystems = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.coolingSystems`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.COOLING_SYSTEMS);
  };

  const handleAddOrEditMechanicalDeficiencies = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.mechanicalDeficiencies`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.MECHANICAL_DEFICIENCIES);
  };

  const handleAddOrEditMechanicalUpdates = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.mechanicalUpdates`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.MECHANICAL_UPDATES);
  };

  const handleAddOrEditGarages = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.garages`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.GARAGES);
  };

  const handleAddOrEditLevels = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.levels`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.LEVELS);
  };

  const onSubmit: SubmitHandler<TUnitsItem> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.UNITS);
  };

  const heatingSystems = form.watch('heatingSystems');
  const coolingSystems = form.watch('coolingSystems');
  const mechanicalDeficiencies = form.watch('mechanicalDeficiencies');
  const mechanicalUpdates = form.watch('mechanicalUpdates');
  const garages = form.watch('garages');
  const levels = form.watch('levels');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.UNIT)}
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
              name="aduIndicator"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>ADU Indicator</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormArrayControl
              title={`Heating Systems ${heatingSystems?.length > 0 ? `(${heatingSystems?.length})` : ''}`}
              errorMessage={form.formState?.errors?.heatingSystems ? 'Required' : ''}
              description={heatingSystems?.length ? 'Edit information' : 'Add information'}
              mode={heatingSystems?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditHeatingSystems()}
              onEdit={() => handleAddOrEditHeatingSystems()}
            />

            <FormArrayControl
              title={`Cooling Systems ${coolingSystems?.length > 0 ? `(${coolingSystems?.length})` : ''}`}
              errorMessage={form.formState?.errors?.coolingSystems ? 'Required' : ''}
              description={coolingSystems?.length ? 'Edit information' : 'Add information'}
              mode={coolingSystems?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditCoolingSystems()}
              onEdit={() => handleAddOrEditCoolingSystems()}
            />

            <FormArrayControl
              title={`Mechanical Deficiencies ${mechanicalDeficiencies?.length > 0 ? `(${mechanicalDeficiencies?.length})` : ''}`}
              errorMessage={form.formState?.errors?.mechanicalDeficiencies ? 'Required' : ''}
              description={mechanicalDeficiencies?.length ? 'Edit information' : 'Add information'}
              mode={mechanicalDeficiencies?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditMechanicalDeficiencies()}
              onEdit={() => handleAddOrEditMechanicalDeficiencies()}
            />

            <FormArrayControl
              title={`Mechanical Updates ${mechanicalUpdates?.length > 0 ? `(${mechanicalUpdates?.length})` : ''}`}
              errorMessage={form.formState?.errors?.mechanicalUpdates ? 'Required' : ''}
              description={mechanicalUpdates?.length ? 'Edit information' : 'Add information'}
              mode={mechanicalUpdates?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditMechanicalUpdates()}
              onEdit={() => handleAddOrEditMechanicalUpdates()}
            />

            <FormArrayControl
              title={`Garages ${garages?.length > 0 ? `(${garages?.length})` : ''}`}
              errorMessage={form.formState?.errors?.garages ? 'Required' : ''}
              description={garages?.length ? 'Edit information' : 'Add information'}
              mode={garages?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditGarages()}
              onEdit={() => handleAddOrEditGarages()}
            />

            <FormArrayControl
              title={`Levels ${levels?.length > 0 ? `(${levels?.length})` : ''}`}
              errorMessage={form.formState?.errors?.levels ? 'Required' : ''}
              description={levels?.length ? 'Edit information' : 'Add information'}
              mode={levels?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditLevels()}
              onEdit={() => handleAddOrEditLevels()}
            />

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.UNITS);
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

export default UnitsItemForm;
