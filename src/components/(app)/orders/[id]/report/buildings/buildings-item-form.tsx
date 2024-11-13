'use client';

import { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _cloneDeep from 'lodash/cloneDeep';

import { notify } from '@/components/ui/toastify/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { MultiSelect } from '@/components/ui/multi-select';
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
  BUILDINGS_STRUCTURE_TYPES,
  BUILDINGS_ATTACHMENT_TYPES,
  BUILDINGS_FOUNDATION_TYPES,
  BUILDINGS_CONSTRUCTION_STATUS,
  BUILDINGS_CONSTRUCTION_TYPES,
} from '@/utils/api/schemas/constants';
import { TBuildingsItemSchema, buildingsItemSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TBuildingsItemSchema | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TBuildingsItemSchema, path: string) => Promise<boolean>;
  onNextStep: (step: string) => void;
  onNextPath: (path: string) => void;
  onBackward: () => void;
  isPartiallyFilled?: boolean;
  isViewMode?: boolean;
}

const removeExtraFields = (data: TBuildingsItemSchema) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.structureType !== 'DWELLING') {
    delete cleanedData.yearBuilt;
    delete cleanedData.yearBuiltEstimate;
  }

  return cleanedData;
};

const getFormDefaultValues = (data: TData) => {
  return {
    ...(data || {}),
    structureType: data?.structureType || BUILDINGS_STRUCTURE_TYPES[0],
  };
};

const BuildingsItemForm = ({
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
  const form = useForm<TBuildingsItemSchema>({
    resolver: zodResolver(buildingsItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const handleAddOrEditExteriorDeficiencies = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.exteriorDeficiencies`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCIES);
  };

  const handleAddOrEditExteriorUpdates = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.exteriorUpdates`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.EXTERIOR_UPDATES);
  };

  const handleAddOrEditUnits = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.units`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.UNITS);
  };

  const onSubmit: SubmitHandler<TBuildingsItemSchema> = async (data) => {
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

    onNextPath('buildings');
    onNextStep(BUILDINGS_INNER_SEGMENT.MAIN);
  };

  const structureType = form.watch('structureType');
  const exteriorDeficiencies = form.watch('exteriorDeficiencies');
  const exteriorUpdates = form.watch('exteriorUpdates');
  const units = form.watch('units');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.BUILDING)}
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
              name="structureType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structure Type</FormLabel>
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
                        {BUILDINGS_STRUCTURE_TYPES.map((value) => (
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
            <FormField
              control={form.control}
              name="structureArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Structure Area</FormLabel>
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
              name="attachmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment Type</FormLabel>
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
                        {BUILDINGS_ATTACHMENT_TYPES.map((value) => (
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
            <FormField
              control={form.control}
              name="foundationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foundation Type</FormLabel>
                  <div className="flex w-full gap-x-2.5">
                    <MultiSelect
                      disabled={isViewMode}
                      options={BUILDINGS_FOUNDATION_TYPES.map((item) => ({
                        label: item.replace(/_/g, ' '),
                        value: item,
                      }))}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select values..."
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="constructionStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Status</FormLabel>
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
                        {BUILDINGS_CONSTRUCTION_STATUS.map((value) => (
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
            <FormField
              control={form.control}
              name="constructionType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Construction Type</FormLabel>
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
                        {BUILDINGS_CONSTRUCTION_TYPES.map((value) => (
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
            <FormField
              control={form.control}
              name="containsRooms"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Contains Rooms</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {structureType === 'DWELLING' && (
              <>
                <FormField
                  control={form.control}
                  name="yearBuilt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year Built</FormLabel>
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

                <FormField
                  control={form.control}
                  name="yearBuiltEstimate"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Year Built Estimate</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormArrayControl
              title={`Exterior Deficiencies ${exteriorDeficiencies?.length > 0 ? `(${exteriorDeficiencies?.length})` : ''}`}
              errorMessage={form.formState?.errors?.exteriorDeficiencies ? 'Required' : ''}
              description={exteriorDeficiencies?.length ? 'Edit information' : 'Add information'}
              mode={exteriorDeficiencies?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditExteriorDeficiencies()}
              onEdit={() => handleAddOrEditExteriorDeficiencies()}
            />

            <FormArrayControl
              title={`Exterior Updates ${exteriorUpdates?.length > 0 ? `(${exteriorUpdates?.length})` : ''}`}
              errorMessage={form.formState?.errors?.exteriorUpdates ? 'Required' : ''}
              description={exteriorUpdates?.length ? 'Edit information' : 'Add information'}
              mode={exteriorUpdates?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditExteriorUpdates()}
              onEdit={() => handleAddOrEditExteriorUpdates()}
            />

            <FormArrayControl
              title={`Units ${units?.length > 0 ? `(${units?.length})` : ''}`}
              errorMessage={form.formState?.errors?.units ? 'Required' : ''}
              description={units?.length ? 'Edit information' : 'Add information'}
              mode={units?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditUnits()}
              onEdit={() => handleAddOrEditUnits()}
            />

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.MAIN);
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

export default BuildingsItemForm;
