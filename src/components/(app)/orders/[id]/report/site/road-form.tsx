'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { SITE_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';
import { ROAD_OWNERSHIP_TYPES } from '@/utils/api/schemas/constants';
import { offSiteFeatureSchema, TRoad } from '@/utils/api/schemas/report';

import ReportSectionHeader from '../report-section-header';

type TData = TRoad | undefined;
const roadSchema = offSiteFeatureSchema.pick({ road: true });

interface IProps {
  stepDescription: string;
  data: TData;
  onSave: (data: TRoad) => void;
  onNextStep: (step: string) => void;
  isViewMode?: boolean;
}

const INITIAL_OBJECT_ITEM = {
  roadOwnershipType: 'PUBLIC',
  roadMaintainedIndicator: false,
  yearRoundAccessIndicator: false,
} as TRoad['road'];

const getFormDefaultValues = (data: TData) => {
  return {
    road: data?.road || {
      ...INITIAL_OBJECT_ITEM,
    },
  };
};

const RoadForm = ({ stepDescription, data, onSave, onNextStep, isViewMode = false }: IProps) => {
  const form = useForm<TRoad>({
    resolver: zodResolver(roadSchema),
    defaultValues: getFormDefaultValues(data),
  });

  const controlBasePathName = 'road';
  const roadOwnershipTypeValue = form.watch(`${controlBasePathName}.roadOwnershipType`);

  const onSubmit: SubmitHandler<TRoad> = async (data) => {
    onSave(data);
    onNextStep(SITE_INNER_SEGMENT.MAIN);
  };

  return (
    <div className="w-full max-w-[612px] flex-col items-center">
      <header className="mb-[60px]">
        <ReportSectionHeader
          title={calcInnerSegmentTitle(SITE_INNER_SEGMENT.ROAD)}
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
            <FormField
              control={form.control}
              name={`${controlBasePathName}.roadOwnershipType`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Road Ownership Type</FormLabel>
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
                        {ROAD_OWNERSHIP_TYPES.map((value) => (
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

            {(roadOwnershipTypeValue === 'PRIVATE' || roadOwnershipTypeValue === 'UNKNOWN') && (
              <FormField
                control={form.control}
                name={`${controlBasePathName}.roadMaintainedIndicator`}
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2.5 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled={isViewMode}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel>Road Maintained Indicator</FormLabel>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name={`${controlBasePathName}.yearRoundAccessIndicator`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2.5 space-y-0">
                  <FormControl>
                    <Checkbox
                      disabled={isViewMode}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Year Round Access Indicator</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

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

export default RoadForm;
