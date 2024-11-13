'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

import { loginUserSchema, TLoginUserSchema } from '@/utils/api/schemas/profile';
import { login } from '@/app/(auth)/actions';

const LoginForm = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');

  const form = useForm<TLoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<TLoginUserSchema> = async (data) => {
    try {
      const result = await login(data);

      if (!result.success) {
        setMessage('Wrong email or password. Please try again');
        return;
      }

      form.reset();
      router.push('/orders');
    } catch (error) {
      setMessage('Something went wrong!. Please try again');
    }
  };

  return (
    <>
      <div>
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
            <div>
              <p className="mt-16 text-center text-base font-normal">
                {`You don't have an account? `}
                <Button
                  variant={'baseLink'}
                  size={'inline'}
                  asChild
                >
                  <Link href="/sign-up">Create an account</Link>
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
                {form.formState.isSubmitting ? 'Logging in...' : 'Continue'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      {message && <p className="mt-10 text-center text-sm text-gray-400">{message}</p>}
    </>
  );
};

export default LoginForm;
