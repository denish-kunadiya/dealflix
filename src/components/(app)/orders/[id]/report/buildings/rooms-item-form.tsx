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
import { ROOM_TYPE } from '@/utils/api/schemas/constants';

import { TRoomsItem, roomsItemSchema } from '@/utils/api/schemas/report';

import FormArrayControl from '../form-array-control';
import ReportSectionHeader from '../report-section-header';

type TData = TRoomsItem | undefined;

interface IProps {
  path: string;
  stepDescription: string;
  data: TData;
  onSave: (data: TRoomsItem, path: string) => Promise<boolean>;
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

const isShouldAddPlumbingFixtures = (roomType: TRoomsItem['roomType']) => {
  return ['FULL_BATH', 'HALF_BATH', 'KITCHEN', 'BUTLERS_PANTRY', 'LAUNDRY_ROOM'].includes(roomType);
};

const removeExtraFields = (data: TRoomsItem) => {
  const cleanedData = _cloneDeep(data);

  if (cleanedData.roomType !== 'OTHER_ROOM') {
    delete cleanedData.otherRoomTypeDescription;
  }

  if (cleanedData.roomType !== 'KITCHEN') {
    cleanedData.appliances = {};
  } else {
    cleanedData.appliances = {
      rangeOvenExists: !!cleanedData.appliances?.rangeOvenExists,
    };
  }

  if (!isShouldAddPlumbingFixtures(cleanedData.roomType)) {
    delete cleanedData.plumbingFixtures;
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
  const form = useForm<TRoomsItem>({
    resolver: zodResolver(roomsItemSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const handleAddOrEditPlumbingFixtures = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.plumbingFixtures`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.PLUMBING_FIXTURES);
  };

  const handleAddOrEditRoomFeatures = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.roomFeatures`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.ROOM_FEATURES);
  };

  const handleAddOrEditInteriorDeficiencies = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.interiorDeficiencies`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCIES);
  };

  const handleAddOrEditInteriorUpdates = async () => {
    await form.trigger();
    onSave(form.getValues(), path);
    const nextPath = `${path}.interiorUpdates`;
    onNextPath(nextPath);
    onNextStep(BUILDINGS_INNER_SEGMENT.INTERIOR_UPDATES);
  };

  const onSubmit: SubmitHandler<TRoomsItem> = async (data) => {
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
    onNextStep(BUILDINGS_INNER_SEGMENT.ROOMS);
  };

  const roomType = form.watch('roomType');
  const plumbingFixtures = form.watch('plumbingFixtures');
  const roomFeatures = form.watch('roomFeatures');
  const interiorDeficiencies = form.watch('interiorDeficiencies');
  const interiorUpdates = form.watch('interiorUpdates');

  useEffect(() => {
    if (isPartiallyFilled) {
      form.trigger();
    }
  }, [isPartiallyFilled, form]);

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(BUILDINGS_INNER_SEGMENT.ROOM)}
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
              name="roomType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Room Type</FormLabel>
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
                        {ROOM_TYPE.map((value) => (
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

            {roomType === 'KITCHEN' && (
              <FormField
                control={form.control}
                name="appliances.rangeOvenExists"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2.5 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled={isViewMode}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Range Oven Exists</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {roomType === 'OTHER_ROOM' && (
              <FormField
                control={form.control}
                name="otherRoomTypeDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Room Type Description</FormLabel>
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
            )}

            {isShouldAddPlumbingFixtures(roomType) && (
              <FormArrayControl
                title={`Plumbing Fixtures ${plumbingFixtures && plumbingFixtures?.length > 0 ? `(${plumbingFixtures?.length})` : ''}`}
                errorMessage={form.formState?.errors?.plumbingFixtures ? 'Required' : ''}
                description={plumbingFixtures?.length ? 'Edit information' : 'Add information'}
                mode={plumbingFixtures?.length ? 'edit' : 'add'}
                onAdd={() => handleAddOrEditPlumbingFixtures()}
                onEdit={() => handleAddOrEditPlumbingFixtures()}
              />
            )}

            <FormArrayControl
              title={`Room Features ${roomFeatures?.length > 0 ? `(${roomFeatures?.length})` : ''}`}
              errorMessage={form.formState?.errors?.roomFeatures ? 'Required' : ''}
              description={roomFeatures?.length ? 'Edit information' : 'Add information'}
              mode={roomFeatures?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditRoomFeatures()}
              onEdit={() => handleAddOrEditRoomFeatures()}
            />

            <FormArrayControl
              title={`Interior Deficiencies ${interiorDeficiencies?.length > 0 ? `(${interiorDeficiencies?.length})` : ''}`}
              errorMessage={form.formState?.errors?.interiorDeficiencies ? 'Required' : ''}
              description={interiorDeficiencies?.length ? 'Edit information' : 'Add information'}
              mode={interiorDeficiencies?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditInteriorDeficiencies()}
              onEdit={() => handleAddOrEditInteriorDeficiencies()}
            />

            <FormArrayControl
              title={`Interior Updates ${interiorUpdates?.length > 0 ? `(${interiorUpdates?.length})` : ''}`}
              errorMessage={form.formState?.errors?.interiorUpdates ? 'Required' : ''}
              description={interiorUpdates?.length ? 'Edit information' : 'Add information'}
              mode={interiorUpdates?.length ? 'edit' : 'add'}
              onAdd={() => handleAddOrEditInteriorUpdates()}
              onEdit={() => handleAddOrEditInteriorUpdates()}
            />

            <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
              <Button
                variant="ghost"
                disabled={form.formState.isSubmitting}
                className="flex-1 basis-48"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  onBackward();
                  onNextStep(BUILDINGS_INNER_SEGMENT.ROOMS);
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
