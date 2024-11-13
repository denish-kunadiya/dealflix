'use client';
import { Button } from '@/components/ui/button';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import StateAutocomplete from './state-autocomplete';
import { Minus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TOrderFilterSchema, orderFilterSchema } from '@/utils/api/schemas/order';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icon } from '@/components/ui/icon';

interface IProps {
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
  setFilter: Dispatch<SetStateAction<OrderFilter>>;
  filter: OrderFilter;
}

const FilterDrawer: React.FC<IProps> = ({ isDrawerOpen, handleDrawerClose, setFilter, filter }) => {
  const cleanFilter = (filter: OrderFilter): TOrderFilterSchema => ({
    ...filter,
    mile: typeof filter.mile === 'number' ? filter.mile : undefined,
  });

  const form = useForm<TOrderFilterSchema>({
    resolver: zodResolver(orderFilterSchema),
    defaultValues: cleanFilter(filter),
  });

  const stateValue = form.watch('state');

  const onSubmit: SubmitHandler<TOrderFilterSchema> = async (data) => {
    const isNotEqual =
      filter.floor !== data.floor || filter.mile !== data.mile || filter.state !== data.state;

    if (isNotEqual) {
      setFilter((prev: OrderFilter) => ({
        ...prev,
        ...data,
      }));
    }
    handleDrawerClose();
  };

  const handleIncrement = (field: any) => {
    const newValue = (Number(field.value) || 0) + 1;
    form.setValue(field.name, Math.min(newValue));
  };

  const handleDecrement = (field: any) => {
    form.setValue(field.name, Math.max((Number(field.value) || 0) - 1, 0));
  };

  useEffect(() => {
    if (isDrawerOpen) {
      form.reset(cleanFilter(filter));
    }
  }, [form, filter, isDrawerOpen]);

  const handleClear = () => {
    if (filter.mile || filter.floor || filter.state) {
      setFilter({ floor: 0, mile: 0, state: '' });
    } else {
      form.reset();
    }
  };

  const handleChangeMile = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value.replace(/[^\d]/g, '').replace('mile', '');
    const numericValue = value ? parseInt(value) : 0;
    form.setValue(field.name, numericValue);
    e.target.value = value + ' mile';
  };

  const handleMileInput = (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const selectionStart = e.target.selectionStart;
    const value = e.target.value.replace(/[^\d]/g, '').replace('mile', '');
    const numericValue = value ? parseInt(value) : 0;
    form.setValue(field.name, numericValue);
    e.target.value = value + ' mile';
    selectionStart &&
      e.target.setSelectionRange(
        Math.min(selectionStart, value.length),
        Math.min(selectionStart, value.length),
      );
  };

  return (
    <>
      <div>
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#3341551F] opacity-50"
            onClick={handleDrawerClose}
          ></div>
        )}
        <div
          id="drawer-navigation"
          className={`fixed right-0 top-0 z-40 h-full w-3/4 overflow-y-auto bg-white p-4 transition-transform dark:bg-slate-800 sm:w-1/3 md:w-[489px] lg:w-[489px] xl:w-[489px] ${
            isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          tabIndex={-1}
          aria-labelledby="drawer-navigation-label"
        >
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
              <div className="flex items-center justify-between border-b py-2 ">
                <h5
                  id="drawer-navigation-label"
                  className="text-[22px] font-bold text-slate-900 dark:text-slate-400"
                >
                  Filters
                </h5>
                <div className="flex items-center">
                  {(form.watch('floor') || form.watch('mile') || form.watch('state')) && (
                    <Button
                      size="sm"
                      type="button"
                      className="me-5 w-[100px] border"
                      onClick={handleClear}
                      variant={'outline'}
                    >
                      Reset
                    </Button>
                  )}
                  <Button
                    className="me-5 w-[100px]"
                    type="submit"
                    size="sm"
                    disabled={form.formState.isSubmitting}
                  >
                    Apply
                  </Button>
                  <Button
                    className="m-0 flex h-9 w-9 items-center rounded-lg bg-sky-100 p-0"
                    type="button"
                    variant={'ghost'}
                    onClick={handleDrawerClose}
                  >
                    <Icon
                      icon="x"
                      size="sm"
                      className=" text-sky-500"
                    />
                  </Button>
                </div>
              </div>
              <div className="divider divider-start"></div>
              <div className="py-4">
                <p className="mb-1 block text-sm text-slate-900 dark:text-white">State</p>
                <StateAutocomplete
                  setSelectedState={(v) => form.setValue('state', v)}
                  selectedState={stateValue}
                />
                <input
                  type="hidden"
                  {...form.register('state')}
                />

                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="floor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of floors in a house </FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Button
                              onClick={() => handleDecrement(field)}
                              type="button"
                              className="absolute bottom-0 left-0 top-0 flex h-full items-center justify-center border-none bg-transparent px-3  hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            >
                              <Minus className="h-[18px] w-[18px] text-slate-900" />
                            </Button>
                            <Input
                              type="text"
                              className="block w-full bg-white text-center text-sm font-normal text-slate-900 focus:border-0"
                              placeholder="Enter a number"
                              {...field}
                              value={
                                field.value === 0 || field.value === undefined ? '' : field.value
                              }
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
                              <Icon
                                icon="plus"
                                size="sm"
                                className=" text-slate-900"
                              />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-5">
                  <FormField
                    control={form.control}
                    name="mile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Search range in miles (1 to 20 miles): </FormLabel>
                        <FormControl>
                          <div className="relative flex items-center">
                            <Button
                              type="button"
                              onClick={() => handleDecrement(field)}
                              className="absolute bottom-0 left-0 top-0 flex h-full items-center justify-center border-none bg-transparent px-3 text-slate-900 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            >
                              <Minus className="h-[18px] w-[18px] text-slate-900" />
                            </Button>
                            <Input
                              type="text"
                              className="block w-full bg-white text-center text-sm font-normal text-slate-900 focus:border-0"
                              placeholder="1 mile"
                              {...field}
                              value={
                                field.value === 0 || field.value === undefined
                                  ? ''
                                  : `${field.value} mile`
                              }
                              onFocus={(e) => {
                                const value = e.target.value.replace(' mile', '');
                                e.target.value = value !== '' ? value + ' mile' : value;
                                e.target.setSelectionRange(value.length, value.length);
                              }}
                              onChange={(e) => handleChangeMile(e, field)}
                              onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                                handleMileInput(e, field)
                              }
                            />
                            <Button
                              type="button"
                              onClick={() => handleIncrement(field)}
                              className="absolute bottom-0 right-0 top-0 flex h-full items-center justify-center border-none bg-transparent px-3 text-slate-900 hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-slate-100"
                            >
                              <Icon
                                icon="plus"
                                size="sm"
                                className=" text-slate-900"
                              />
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
