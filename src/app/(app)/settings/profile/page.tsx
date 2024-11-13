'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, TProfileUpdateSchema } from '@/utils/api/schemas/profile';
import { updateProfile } from './actions';
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

const ProfilePage = () => {
  const form = useForm<TProfileUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      postalCode: '',
    },
  });

  const onSubmit: SubmitHandler<TProfileUpdateSchema> = async (data) => {
    const result = await updateProfile(data);
  };

  return (
    <div className="py-10">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">Some description here.</p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="First name"
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
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Last name"
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
                  <FormLabel>ZIP / Postal code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ZIP / Postal code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-6 flex items-center justify-end gap-x-6">
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ProfilePage;
