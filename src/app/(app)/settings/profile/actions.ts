'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '@/utils/supabase/helpers/get-user-id';
import { profileUpdateSchema } from '@/utils/api/schemas/profile';
import { ERROR_TYPES, ERROR_CODES, HTTP_STATUS_CODES } from '@/utils/api/constants';
import { createErrorData } from '@/utils/api/helpers';
import { ApiResponseData } from '@/types/api';

export const updateProfile = async (data: any) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId) return null;

  const validatedFields = profileUpdateSchema.safeParse(data);

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

  const payload = {
    first_name: data.firstName,
    last_name: data.lastName,
    postal_code: data.postalCode,
  };

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('profile').update(payload).eq('user_id', userId);

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
};
