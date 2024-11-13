import { z } from 'zod';

export const profileUpdateSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  postalCode: z.string().min(1, { message: 'Postal code is required' }),
});

const atLeastOneUppercaseLetterRe = /[A-Z]/;
const atLeastOneLowercaseLetterRe = /[a-z]/;
const atLeastOneNumberRe = /\d/;
const atLeastOneSpecialCharRe = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

export const userLocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});
export const userGeneralInfoSchema = z.object({
  postalCode: z.string().min(5, { message: 'Postal is too short' }),
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
});

const userSensitiveInfoSchemaWithoutConfirmPassword = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number is too short' }),
  password: z
    .string()
    .min(8, { message: 'Password is too short' })
    .max(255, { message: 'Password is too long' })
    .regex(atLeastOneUppercaseLetterRe, {
      message: 'Must contain at least one uppercase letter',
    })
    .regex(atLeastOneLowercaseLetterRe, {
      message: 'Must contain at least one lowercase letter',
    })
    .regex(atLeastOneNumberRe, {
      message: 'Must contain at least one number',
    })
    .regex(atLeastOneSpecialCharRe, {
      message: 'Must contain at least one special character',
    }),
});

export const userSensitiveInfoSchema = userSensitiveInfoSchemaWithoutConfirmPassword
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match!',
    path: ['confirmPassword'],
  });

export const userCreateSchema = userGeneralInfoSchema
  .merge(userSensitiveInfoSchemaWithoutConfirmPassword)
  .merge(userLocationSchema);

export const loginUserSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type TLoginUserSchema = z.infer<typeof loginUserSchema>;
export type TUserGeneralInfoSchema = z.infer<typeof userGeneralInfoSchema>;
export type TUserSensitiveInfoSchema = z.infer<typeof userSensitiveInfoSchema>;
export type TUserCreateSchema = z.infer<typeof userCreateSchema>;

export type TProfileUpdateSchema = z.infer<typeof profileUpdateSchema>;
