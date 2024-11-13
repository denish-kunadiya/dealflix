'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
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

import {
  userSensitiveInfoSchema,
  TUserSensitiveInfoSchema,
  TUserGeneralInfoSchema,
} from '@/utils/api/schemas/profile';

import { signUp } from '@/app/(auth)/actions';

type TUserSensitiveDataFormProps = {
  userGeneralInfo: TUserGeneralInfoSchema;
  latLong: LatLong;
};

interface LatLong {
  latitude: number;
  longitude: number;
}

const UserSensitiveDataForm = ({ userGeneralInfo, latLong }: TUserSensitiveDataFormProps) => {
  const [message, setMessage] = useState('');
  const form = useForm<TUserSensitiveInfoSchema>({
    resolver: zodResolver(userSensitiveInfoSchema),
    defaultValues: {
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit: SubmitHandler<TUserSensitiveInfoSchema> = async (data) => {
    try {
      const payload = {
        ...userGeneralInfo,
        ...latLong,
        ...data,
      };
      const result = await signUp(payload);

      if (!result.success) {
        setMessage('Something went wrong!. Please try again');
        return;
      }

      setMessage('Check email to continue sign in process');
      form.reset();
    } catch (error) {
      setMessage('Something went wrong!. Please try again');
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your email..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone number</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your contact phone number ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter your password..."
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Repeat password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Confirm your password..."
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <p className="mt-9 text-xs">
              {
                'By clicking on the button you agree to the processing of personal data. By continuing you agree to the '
              }
              <Button
                className="text-xs"
                variant={'baseLink'}
                size={'inline'}
                asChild
              >
                <Link href="#">Privacy Policy</Link>
              </Button>
              {' and '}
              <Button
                className="text-xs"
                variant={'baseLink'}
                size={'inline'}
                asChild
              >
                <Link href="#">Terms of Use</Link>
              </Button>
            </p>
            <Button
              disabled={form.formState.isSubmitting}
              className="mt-2.5 w-full"
              size={'xl'}
              type="submit"
            >
              {form.formState.isSubmitting ? 'Creating...' : 'Create an account'}
            </Button>
          </div>
        </form>
      </Form>
      {message && <p className="mt-10 text-center text-sm text-slate-400">{message}</p>}
    </>
  );
};

export default UserSensitiveDataForm;
