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
import { BELOW_GRADE_EXITS, ATTIC_ACCESS } from '@/utils/api/schemas/constants';

import { TLevelsItem, levelsItemSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TLevelsItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TLevelsItem, path: string) => Promise<boolean>;
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

const removeExtraFields = (data: TLevelsItem) => {
  const cleanedData = _cloneDeep(data);

  cleanedData.belowGrade = !!cleanedData.belowGrade;
  cleanedData.levelLowCeiling = !!cleanedData.levelLowCeiling;
  cleanedData.attic = !!cleanedData.attic;
  cleanedData.atticAccessLocation = !!cleanedData.atticAccessLocation;

  if (!cleanedData.belowGrade) {
    delete cleanedData.belowGradeExits;
  }

  if (!cleanedData.attic) {
    delete cleanedData.atticAccess;
    delete cleanedData.atticAccessLocation;
  }

  return cleanedData;
};

const LevelsItemForm = ({
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
  const form = useForm<TLevelsItem>({
    resolver: zodResolver(levelsItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const handleAddOrEditRooms = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.rooms`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.ROOMS);
  };

  const onSubmit: SubmitHandler<TLevelsItem> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.LEVELS);
  };

  const belowGrade = form.watch('belowGrade');
  const attic = form.watch('attic');
  const rooms = form.watch('rooms');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.LEVEL)}
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
              name="levelNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Level Number</FormLabel>
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
              name="belowGrade"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Below Grade</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {belowGrade && (
              <FormField
                control={form.control}
                name="belowGradeExits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Below Grade Exits</FormLabel>
                    <div className="flex w-full gap-x-2.5">
                      <MultiSelect
                        disabled={isViewMode}
                        options={BELOW_GRADE_EXITS.map((item) => ({
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
            )}

            <FormField
              control={form.control}
              name="levelLowCeiling"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Level Low Ceiling</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="attic"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Attic</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {attic && (
              <>
                <FormField
                  control={form.control}
                  name="atticAccess"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attic Access</FormLabel>
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
                            {ATTIC_ACCESS.map((value) => (
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
                  name="atticAccessLocation"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2.5 space-y-0">
                      <FormControl>
                        <Checkbox
                          disabled={isViewMode}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Attic Access Location</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <FormField
              control={form.control}
              name="totalArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Area</FormLabel>
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
              name="finishedArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Finished Area</FormLabel>
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
              name="nonStandardFinishedArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Non Standard Finished Area</FormLabel>
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

            <FormArrayControl
              title={`Rooms ${rooms?.length > 0 ? `(${rooms?.length})` : ''}`}
              errorMessage={form.formState?.errors?.rooms ? 'Required' : ''}
              description={rooms?.length ? 'Edit information' : 'Add information'}
              mode={rooms?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditRooms()}
              onEdit={() => handleAddOrEditRooms()}
            />

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.LEVELS);
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

export default LevelsItemForm;
