'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createErrorData } from '@/utils/api/helpers';
import { ApiResponseData } from '@/types/api';
import {
  userCreateSchema,
  TUserCreateSchema,
  loginUserSchema,
  TLoginUserSchema,
} from '@/utils/api/schemas/profile';
import { ERROR_TYPES, ERROR_CODES, HTTP_STATUS_CODES } from '@/utils/api/constants';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export const login = async (data: TLoginUserSchema) => {
  try {
    const validatedFields = loginUserSchema.safeParse(data);

    if (!validatedFields.success) {
      const resDataWithValidationError: ApiResponseData = {
        success: false,
        statusCode: HTTP_STATUS_CODES.BAD_REQ,
        error: createErrorData({
          type: ERROR_TYPES.INVALID_REQ_ERROR,
          code: ERROR_CODES.PARAMETER_MISSING_INVALID,
          details: validatedFields.error.flatten().fieldErrors,
        }),
      };

      return resDataWithValidationError;
    }

    const supabase = createSupabaseServerClient();

    const payload = {
      email: data.email,
      password: data.password,
    };

    const { error } = await supabase.auth.signInWithPassword(payload);

    if (error) {
      const resDataWithApiError: ApiResponseData = {
        success: false,
        statusCode: HTTP_STATUS_CODES.SERVER_ERR,
        error: createErrorData({
          type: ERROR_TYPES.API_ERROR,
          code: ERROR_CODES.SERVER_WRONG,
        }),
      };
      return resDataWithApiError;
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    const resData: ApiResponseData = {
      success: false,
      statusCode: HTTP_STATUS_CODES.SERVER_ERR,
    };

    return resData;
  }
};

export const signUp = async (data: TUserCreateSchema) => {
  try {
    const origin = headers().get('origin');

    const validatedFields = userCreateSchema.safeParse(data);

    if (!validatedFields.success) {
      const resDataWithValidationError: ApiResponseData = {
        success: false,
        statusCode: HTTP_STATUS_CODES.BAD_REQ,
        error: createErrorData({
          type: ERROR_TYPES.INVALID_REQ_ERROR,
          code: ERROR_CODES.PARAMETER_MISSING_INVALID,
          details: validatedFields.error.flatten().fieldErrors,
        }),
      };

      return resDataWithValidationError;
    }

    const supabase = createSupabaseServerClient();

    const signUpPayload = {
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${origin}/confirm`,
        data: {
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          postal_code: data.postalCode,
          email: data.email,
          latitude: data.latitude,
          longitude: data.longitude,
        },
      },
    };

    const { error } = await supabase.auth.signUp(signUpPayload);

    if (error) {
      const resDataWithApiError: ApiResponseData = {
        success: false,
        statusCode: HTTP_STATUS_CODES.SERVER_ERR,
        error: createErrorData({
          type: ERROR_TYPES.API_ERROR,
          code: ERROR_CODES.SERVER_WRONG,
        }),
      };
      return resDataWithApiError;
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    const resData: ApiResponseData = {
      success: false,
      statusCode: HTTP_STATUS_CODES.SERVER_ERR,
    };

    return resData;
  }
};

export const getLatLong = async (postalCode: string) => {
  try {
    const geoInfo: any = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&components=postal_code:${postalCode}`,
    );

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: await geoInfo.json(),
    };

    return resData;
  } catch (error) {
    const resData: ApiResponseData = {
      success: false,
      statusCode: HTTP_STATUS_CODES.SERVER_ERR,
    };

    return resData;
  }
};

export const getLatLongWithAddress = async (address: string) => {
  try {
    const geoInfo: any = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?key=${process.env.GOOGLE_API_KEY}&&address=${encodeURIComponent(address)}`,
    );

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: await geoInfo.json(),
    };

    return resData;
  } catch (error) {
    const resData: ApiResponseData = {
      success: false,
      statusCode: HTTP_STATUS_CODES.SERVER_ERR,
    };

    return resData;
  }
};
