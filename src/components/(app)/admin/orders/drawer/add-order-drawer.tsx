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
import { TCreateOrderSchema, createOrderSchema } from '@/utils/api/schemas/order';
import { zodResolver } from '@hookform/resolvers/zod';
import { Minus, Plus } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import CustomSelect from '../select-photographer';
import { getPhotographers } from '@/app/admin/orders/action';
import { getLatLong, getLatLongWithAddress } from '@/app/(auth)/actions';
import StateAutocomplete from '@/app/(app)/orders/components/state-autocomplete';
import { ApiErrorData, ApiResponseData } from '@/types/api';
import { notify } from '@/components/ui/toastify/toast';
interface LatLong {
  latitude: number;
  longitude: number;
}
interface IProps {
  createUpdateOrder: (
    orderData: OrderData,
    location: LatLong,
  ) => Promise<{ data: ApiResponseData; error: ApiErrorData | undefined }>;
  editOrderData?: OrderData;
  isDrawerOpen: boolean;
  handleDrawerClose: () => void;
}

const AddOrderDrawer: React.FC<IProps> = ({
  editOrderData,
  createUpdateOrder,
  isDrawerOpen,
  handleDrawerClose,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [photographers, setPhotographers] = useState<AssignedUser[]>([]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const data = await getPhotographers();
    if (data.success) {
      setPhotographers(data.data);
    } else if (data.error) {
      setPhotographers([]);
      notify({
        title: 'Error',
        text: 'Something went wrong',
        type: 'error',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const form = useForm<TCreateOrderSchema>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      assigned: editOrderData?.assignee,
      onsite_contact_name: editOrderData?.onsite_contact_name,
      lender_name: editOrderData?.lender_name,
      borrower_name: editOrderData?.borrower_name,
      amc_name: editOrderData?.amc_name,
      borrower_contact_info: editOrderData?.borrower_contact_info,
      lender_loan_id: editOrderData?.lender_loan_id,
      lender_id: editOrderData?.lender_id,
      onsite_contact_email: editOrderData?.onsite_contact_email,
      deliver_email: editOrderData?.deliver_email,
      onsite_contact_phone: Number(editOrderData?.onsite_contact_phone)
        ? Number(editOrderData?.onsite_contact_phone)
        : undefined,
      lender_contact_phone: editOrderData?.lender_contact_phone,
      state: editOrderData?.state,
      city: editOrderData?.city,
      street_address: editOrderData?.street_address,
      postal_code: Number(editOrderData?.postal_code)
        ? Number(editOrderData?.postal_code)
        : undefined,
      floors_number: Number(editOrderData?.floors_number)
        ? Number(editOrderData?.floors_number)
        : undefined,
    },
  });

  const handleIncrement = (field: any) => {
    form.setValue(field.name, (Number(field.value) || 0) + 1);
  };

  const handleDecrement = (field: any) => {
    form.setValue(field.name, Math.max((Number(field.value) || 0) - 1, 0));
  };

  const stateValue = form.watch('state');

  const onSubmit: SubmitHandler<TCreateOrderSchema> = async (data) => {
    const address = data.street_address;
    const city = data.city;
    const state = data.state;
    const postalCode = data.postal_code;

    const fullAddress = `${address}, ${city}, ${state} ${postalCode}`;
    let lat;
    let lng;

    try {
      const geoInfo = await getLatLongWithAddress(fullAddress);
      if (geoInfo.data.results && geoInfo.data.results.length > 0) {
        lat = geoInfo.data.results[0].geometry.location.lat;
        lng = geoInfo.data.results[0].geometry.location.lng;
      } else {
        const postalCodeGeoInfo: any = await getLatLong(data.postal_code.toString());

        if (postalCodeGeoInfo.data.results && postalCodeGeoInfo.data.results.length > 0) {
          lat = postalCodeGeoInfo.data.results[0].geometry.location.lat;
          lng = postalCodeGeoInfo.data.results[0].geometry.location.lng;
        } else {
          return form.setError('postal_code', {
            type: 'manual',
            message: 'Invalid postal code.',
          });
        }
      }
      if (lat && lng) {
        await createUpdateOrder(
          { ...editOrderData, ...data },
          {
            latitude: Number(lat.toFixed(6)),
            longitude: Number(lng.toFixed(6)),
          },
        );
      }
    } catch (e) {
      console.error('Error fetching geolocation', e);
    }
  };
  const assignedValue = form.watch('assigned');

  return (
    <>
      <div>
        {isDrawerOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#3341551F] opacity-50"
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
        <div className="sticky top-0 z-50 border-b bg-white p-5 dark:bg-slate-800">
          <div className="flex items-center justify-between ">
            <h5
              id="drawer-navigation-label"
              className="pb-[9px] text-[22px] text-base font-bold text-slate-900 dark:text-slate-400"
            >
              {editOrderData && editOrderData.id ? 'Edit' : 'New'} Order
            </h5>
            <div className="space-x-2">
              <Button
                type="button"
                size={'sm'}
                className="h-8 rounded-lg bg-sky-100 px-4 py-1 text-[16px] font-bold"
                onClick={handleDrawerClose}
                variant={'ghost'}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-5 pt-5"
          >
            <div className="flex w-[449px] flex-col gap-10">
              <div className="flex h-[68px] flex-col gap-2">
                <FormLabel>Assigned</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="assigned"
                    render={({}) => (
                      <FormItem>
                        <FormControl>
                          <CustomSelect
                            photographers={photographers}
                            loading={loading}
                            onSelectUser={(v: AssignedUser | null | undefined) => {
                              if (v) {
                                form.setValue('assigned', {
                                  first_name: v.photographer.first_name,
                                  last_name: v.photographer.last_name,
                                  user_id: v.user_id,
                                  email: v.photographer.email,
                                });
                              } else {
                                form.setValue('assigned', undefined);
                              }
                            }}
                            selectedUserId={assignedValue?.user_id}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormLabel>Property Owner Contact Information</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="onsite_contact_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Contact Name"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onsite_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="onsite_contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Email Id"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormLabel>Lender Contact Information</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="lender_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Contact Name"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lender_contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="deliver_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Email Id"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lender_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Lender ID"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lender_loan_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Lender Loan ID"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <FormLabel>Borrower Contact Information</FormLabel>
                <div className="flex flex-col gap-5">
                  <FormField
                    control={form.control}
                    name="borrower_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Borrower Name"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amc_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="AMC Name"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="borrower_contact_info"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Contact Information"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex  flex-col gap-2">
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
                        <div className="h-4">
                          <FormMessage />
                        </div>
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
                            placeholder="City"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="street_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="Street"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postal_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            className="block w-full bg-white text-sm font-normal text-slate-900 focus:border-0"
                            placeholder="ZIP"
                            {...field}
                          />
                        </FormControl>
                        <div className="h-4">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex h-[68px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name="floors_number"
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
                      <div className="h-4">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="sticky bottom-3 z-50 mt-16">
              <Button
                className=" h-12 w-full rounded-lg bg-sky-500 px-4 py-1 font-bold text-white hover:bg-sky-600"
                type="submit"
                disabled={form.formState.isSubmitting}
              >
                {editOrderData && editOrderData.id ? 'Edit' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default AddOrderDrawer;
