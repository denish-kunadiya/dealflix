'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { userGeneralInfoSchema, TUserGeneralInfoSchema } from '@/utils/api/schemas/profile';
import { getLatLong } from '@/app/(auth)/actions';
import { Dispatch, SetStateAction } from 'react';

type TUserGeneralInfoFormProps = {
  onSaveData: (data: TUserGeneralInfoSchema) => void;
  setLatLong: Dispatch<SetStateAction<LatLong>>;
};
interface LatLong {
  latitude: number;
  longitude: number;
}

const UserGeneralInfoForm = ({ onSaveData, setLatLong }: TUserGeneralInfoFormProps) => {
  const form = useForm<TUserGeneralInfoSchema>({
    resolver: zodResolver(userGeneralInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      postalCode: '',
    },
  });

  const handleSaveData = async (data: TUserGeneralInfoSchema) => {
    const latlong: any = await getLatLong(data.postalCode);

    if (!latlong.data.results.length) {
      return form.setError('postalCode', {
        type: 'manual',
        message: 'Invalid postal code.',
      });
    }
    const lat = latlong.data.results[0]?.geometry?.location?.lat;
    const lng = latlong.data.results[0]?.geometry?.location?.lng;

    setLatLong({ latitude: Number(lat.toFixed(6)), longitude: Number(lng.toFixed(6)) });

    onSaveData(data);
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSaveData)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your first name..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your last name..."
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
                <FormLabel>ZIP code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="XXXXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="mt-16 text-center text-base font-normal">
              {`Already a member? `}
              <Button
                variant={'baseLink'}
                size={'inline'}
                asChild
              >
                <Link href="/login">Log in</Link>
              </Button>
            </p>
          </div>

          <div>
            <Button
              disabled={form.formState.isSubmitting}
              className="mt-2.5 w-full"
              size={'xl'}
              type="submit"
            >
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default UserGeneralInfoForm;
