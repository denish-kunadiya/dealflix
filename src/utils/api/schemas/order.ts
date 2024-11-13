import { z } from 'zod';
import { STATES_SHORT_CODES } from '@/utils/constants';

export const orderFilterSchema = z.object({
  floor: z
    .preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: 'Floor must be a number',
        })
        .int({ message: 'Floor must be whole number' })
        .min(0, { message: 'Floor must be a positive number' })
        .max(5, { message: 'Max number of floors is 5' })
        .optional(),
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: 'Floor must be a number',
    }),
  mile: z
    .preprocess(
      (val) => (val === '' || val === null ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: 'Mile must be a number',
        })
        .int({ message: 'Mile must be whole number' })
        .min(0, { message: 'Mile must be a positive number' })
        .max(20, { message: 'Max number of miles is 20' })
        .optional(),
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: 'Mile must be a number',
    }),
  state: z
    .string()
    .refine((val) => val === '' || STATES_SHORT_CODES.includes(val), { message: 'Invalid state' })
    .optional(),
});

export const createOrderSchema = z.object({
  assigned: z.any().optional(),
  onsite_contact_name: z.string().min(5, { message: 'Contact name is too short' }),
  lender_name: z.string().min(5, { message: 'Contact name is too short' }).optional(),
  borrower_name: z.string().min(5, { message: 'Contact name is too short' }),
  amc_name: z.string().min(5, { message: 'Contact name is too short' }),
  borrower_contact_info: z.string().min(5, { message: 'Contact name is too short' }),
  lender_loan_id: z.string().max(255, { message: 'Lender Loan ID is maximum length is 255 char.' }),

  lender_id: z.string().max(255, { message: 'Lender ID is maximum length is 255 char.' }),
  onsite_contact_email: z.string().email('This is not valid email.'),
  deliver_email: z.string().email('This is not valid email.'),
  onsite_contact_phone: z.coerce.number({ invalid_type_error: 'Required number' }).positive(),
  lender_contact_phone: z.coerce
    .number({ invalid_type_error: 'Required number' })
    .positive()
    .optional(),
  state: z
    .string()
    .refine((val) => val === '' || STATES_SHORT_CODES.includes(val), { message: 'Invalid state' }),
  city: z.string().min(5, { message: 'City is too short' }),
  street_address: z.string().min(5, { message: 'Street is too short' }),
  postal_code: z.coerce.number({ invalid_type_error: 'Required number' }).positive(),
  floors_number: z
    .preprocess(
      (val) => (val === '' ? undefined : Number(val)),
      z
        .number({
          invalid_type_error: 'Floor must be a number',
        })
        .int({ message: 'Floor must be whole number' })
        .min(0, { message: 'Floor must be a positive number' })
        .max(5, { message: 'The number is too high' })
        .optional(),
    )
    .refine((val) => val === undefined || !isNaN(val), {
      message: 'Floor must be a number',
    }),
});

export const filterOrderSchema = z.object({
  status: z.string().optional(),
  assignedId: z.any().optional(),
  onsiteContactName: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    },
    z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          return /^[a-zA-Z\s\-]+$/.test(value);
        },
        { message: 'Name can only contain letters, spaces' },
      )
      .refine(
        (value) => {
          if (value) return value.length >= 2 && value.length <= 25;
          return true;
        },
        { message: 'Name must be between 2 and 25 characters long' },
      ),
  ),
  onsiteContactPhone: z
    .preprocess(
      (val) => (val === '' || val === null ? '' : Number(val)),
      z.union([
        z.string({ invalid_type_error: 'Phone number must be a number' }).length(0).optional(),
        z
          .number({
            invalid_type_error: 'Phone number must be a number',
          })
          .int({ message: 'Phone number must be a whole number' })
          .min(0, { message: 'Phone number must be a positive number' })
          .optional(),
      ]),
    )
    .refine((val) => typeof val === 'string' || !isNaN(val as number), {
      message: 'Floor must be a number',
    }),
  createdAt: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return /^\d{4}-\d{2}-\d{2}$/.test(value) && !isNaN(Date.parse(value));
      },
      { message: 'Invalid date. Format should be YYYY-MM-DD' },
    ),
  state: z
    .string()
    .refine((val) => val === '' || STATES_SHORT_CODES.includes(val), { message: 'Invalid state' })
    .optional(),
  city: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    },
    z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          return /^[a-zA-Z\s\-]+$/.test(value);
        },
        { message: 'City name can only contain letters and spaces' },
      )
      .refine(
        (value) => {
          if (value) return value.length >= 2 && value.length <= 25;
          return true;
        },
        { message: 'City name must be between 2 and 25 characters long' },
      ),
  ),
  streetAddress: z.preprocess(
    (value) => {
      if (typeof value === 'string') {
        return value.trim();
      }
      return value;
    },
    z
      .string()
      .optional()
      .refine(
        (value) => {
          if (value) return value.length >= 2 && value.length <= 25;
          return true;
        },
        { message: 'Street name must be between 2 and 25 characters long' },
      ),
  ),
  postalCode: z
    .preprocess(
      (val) => (val === '' || val === null ? '' : Number(val)),
      z.union([
        z.string({ invalid_type_error: 'Postal code must be a number' }).length(0).optional(),
        z
          .number({
            invalid_type_error: 'Postal code must be a number',
          })
          .int({ message: 'Postal code must be a whole number' })
          .min(0, { message: 'Postal code must be a positive number' })
          .optional(),
      ]),
    )
    .refine((val) => typeof val === 'string' || !isNaN(val as number), {
      message: 'Floor must be a number',
    }),
  floorsNumber: z
    .preprocess(
      (val) => (val === '' || val === null ? '' : Number(val)),
      z.union([
        z.string().length(0).optional(),
        z
          .number({
            invalid_type_error: 'Floor must be a number',
          })
          .int({ message: 'Floor must be a whole number' })
          .min(0, { message: 'Floor must be a positive number' })
          .max(5, { message: 'Max number of floors is 5' })
          .optional(),
      ]),
    )
    .refine((val) => typeof val === 'string' || !isNaN(val as number), {
      message: 'Floor must be a number',
    }),
});

export type TOrderFilterSchema = z.infer<typeof orderFilterSchema>;
export type TCreateOrderSchema = z.infer<typeof createOrderSchema>;
export type TFilterOrderSchema = z.infer<typeof filterOrderSchema>;
