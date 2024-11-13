import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { filterOrderSchema, TFilterOrderSchema } from '@/utils/api/schemas/order';
import { Minus, Plus } from 'lucide-react';
import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomSelect from '../select-photographer';
import { getPhotographers } from '@/app/admin/orders/action';
import { Icon } from '@/components/ui/icon';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ORDER_STATUS_KEY_PAIRS } from '@/utils/constants';
import StateAutocomplete from '@/app/(app)/orders/components/state-autocomplete';

interface IProps {
  filter: FilterOrder;
  setFilter: Dispatch<SetStateAction<FilterOrder>>;
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  handleReset: () => void;
}

const FilterOrderDrawer: React.FC<IProps> = ({
  filter,
  setFilter,
  isDrawerOpen,
  handleDrawerClose,
  handleReset,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [photographers, setPhotographers] = useState<AssignedUser[]>([]);

  const form = useForm<TFilterOrderSchema>({
    resolver: zodResolver(filterOrderSchema),
    defaultValues: filter,
  });
  useEffect(() => {
    if (isDrawerOpen) {
      form.reset(filter);
    }
  }, [form, filter, isDrawerOpen]);

  const stateValue = form.watch('state');

  const fetchPhotographer = useCallback(async () => {
    setLoading(true);
    const data = await getPhotographers();
    if (data.success) {
      setPhotographers(data.data);
    } else if (data.error) {
      setPhotographers([]);
      console.error('Error fetching assigned orders:', data.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotographer();
  }, [fetchPhotographer]);

  const handleIncrement = (field: any) => {
    form.setValue(field.name, (Number(field.value) || 0) + 1);
  };

  const handleDecrement = (field: any) => {
    form.setValue(field.name, Math.max((Number(field.value) || 0) - 1, 0));
  };

  const handleClearFilter = () => {
    if (
      filter.assignedId ||
      filter.city ||
      filter.createdAt ||
      filter.floorsNumber ||
      filter.onsiteContactName ||
      filter.onsiteContactPhone ||
      filter.postalCode ||
      filter.state ||
      filter.status ||
      filter.streetAddress
    ) {
      form.setValue('status', '');
      form.setValue('assignedId', '');
      handleReset();
    } else {
      form.reset();
    }
  };

  const onSubmit: SubmitHandler<TFilterOrderSchema> = async (data) => {
    const assignedId = data.assignedId ? data.assignedId : '';
    const isNotEqual =
      assignedId !== filter.assignedId ||
      data.city !== filter.city ||
      data.createdAt !== filter.createdAt ||
      data.floorsNumber !== filter.floorsNumber ||
      data.onsiteContactName !== filter.onsiteContactName ||
      data.onsiteContactPhone !== filter.onsiteContactPhone ||
      data.postalCode !== filter.postalCode ||
      data.state !== filter.state ||
      data.status !== filter.status ||
      data.streetAddress !== filter.streetAddress;

    if (isNotEqual) {
      setFilter({
        ...data,
        ...(assignedId && { assignedId }),
      });
    }
    handleDrawerClose();
  };

  const assignedIdValue = form.watch('assignedId');

  return (
    <>
      <div>
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#E0E4E7] opacity-50"
            onClick={handleDrawerClose}
          ></div>
        )}
      </div>
      <div
        id="drawer-navigation"
        className={`fixed right-0 top-0 z-40 h-screen w-[489px] overflow-y-auto bg-white transition-transform dark:bg-slate-800 ${
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex={-1}
        aria-labelledby="drawer-navigation-label"
      >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-5"
          >
            <div className="flex h-[76px] items-center justify-between border-b">
              <h5
                id="drawer-navigation-label"
                className="pb-[9px] text-[22px] text-base font-bold text-slate-900 dark:text-slate-400"
              >
                Filters
              </h5>
              <div className=" flex space-x-2">
                {form.watch('status') ||
                form.watch('assignedId') ||
                form.watch('onsiteContactName') ||
                form.watch('onsiteContactPhone') ||
                form.watch('createdAt') ||
                form.watch('state') ||
                form.watch('city') ||
                form.watch('streetAddress') ||
                form.watch('postalCode') ||
                form.watch('floorsNumber') ? (
                  <Button
                    type="button"
                    size={'sm'}
                    className="h-8 rounded-lg px-4 py-1 text-[16px] font-bold"
                    onClick={handleClearFilter}
                    variant={'outline'}
                  >
                    Reset
                  </Button>
                ) : (
                  ''
                )}
                <Button
                  type="submit"
                  size={'sm'}
                  className="h-8 rounded-lg px-4 py-1 text-[16px] font-bold"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  Apply
                </Button>
                <Button
                  type="button"
                  size={'sm'}
                  className="h-8 rounded-lg bg-sky-100"
                  onClick={handleDrawerClose}
                  variant={'ghost'}
                >
                  <Icon
                    icon="x"
                    size="sm"
                    className=" text-sky-500"
                  />
                </Button>
              </div>
            </div>
            <div className="mt-10 flex max-h-[865px] w-[449px] flex-col gap-10">
              <div className="flex h-[68px] flex-col gap-2">
                <FormLabel>Status</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select value..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {ORDER_STATUS_KEY_PAIRS.map((value, index) => (
                                <SelectItem
                                  key={`${value.value}`}
                                  value={value.value}
                                >
                                  {value.label.replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex h-[68px] flex-col gap-2">
                <FormLabel>Assigned</FormLabel>
                <div className="flex flex-col gap-5">
                  <CustomSelect
                    photographers={photographers}
                    loading={loading}
                    onSelectUser={(v: any) => {
                      if (v) {
                        form.setValue('assignedId', v.user_id);
                      } else {
                        form.setValue('assignedId', undefined);
                      }
                    }}
                    selectedUserId={assignedIdValue}
                  />
                  <input
                    type="hidden"
                    {...form.register('state')}
                  />
                </div>
              </div>
              <div className="flex h-[130px] flex-col gap-2">
                <FormLabel>Contact Information</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="onsiteContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Contact name..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onsiteContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Phone number..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormLabel>Creation date</FormLabel>
                <div>
                  <FormField
                    control={form.control}
                    name="createdAt"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="YYYY-MM-DD"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormLabel>Location Information</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <StateAutocomplete
                            setSelectedState={(v) => {
                              form.setValue('state', v);
                            }}
                            selectedState={stateValue}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="City..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="streetAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Street..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="ZIP..."
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex h-[68px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name="floorsNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Number of floors in a house </FormLabel>
                      <div className="relative mt-2 flex items-center">
                        <Button
                          onClick={() => handleDecrement(field)}
                          type="button"
                          className="absolute bottom-0 left-0 top-0 flex h-full items-center justify-center border-none bg-transparent px-3 text-slate-900 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                        >
                          <Minus />
                        </Button>
                        <Input
                          type="text"
                          className="block h-11 w-full bg-white text-center text-sm font-normal text-slate-900 focus:border-0"
                          placeholder="Enter a number"
                          {...field}
                          value={field.value === 0 || field.value === undefined ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^\d]/g, '');
                            const numericValue = value ? parseInt(value) : 0;
                            form.setValue(field.name, numericValue);
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => handleIncrement(field)}
                          className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center border-none bg-transparent px-3 text-slate-900 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                        >
                          <Plus />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default FilterOrderDrawer;
