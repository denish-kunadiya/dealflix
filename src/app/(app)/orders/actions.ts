'use server';

import getUserId from '@/utils/supabase/helpers/get-user-id';
import {
  responseDataWithValidationError,
  responseDataWithApiError,
  responseDataWithUnknownError,
} from '@/utils/api/helpers';
import { ApiResponseData } from '@/types/api';
import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import getOrdersUtil from '@/utils/supabase/helpers/get-orders';
import getOrdersInProgressUtil from '@/utils/supabase/helpers/get-orders-in-progress';
import { accept } from '@/utils/supabase/helpers/accept-order';
import { reject } from '@/utils/supabase/helpers/reject-order';
import { book } from '@/utils/supabase/helpers/book-order';
import { getMyOrders } from '@/utils/supabase/helpers/my-orders';
import { allOrders } from '@/utils/supabase/helpers/get-all-orders';
import { checkOrderAvailableToBook } from '@/utils/supabase/helpers/check-order-available-to-book';
import { softDeleteOrder } from '@/utils/supabase/helpers/soft-delete-order';

export const getOrders = async (filters?: any) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const { error, data } = await getOrdersUtil();

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const getOrdersInProgress = async (filters?: any) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const { error, data } = await getOrdersInProgressUtil();

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const getAllOrders = async (filter?: OrderFilter) => {
  const newFilter = {
    ...(filter?.floor && { floor: filter.floor }),
    ...(filter?.searchVal?.trim() && { searchVal: filter.searchVal.trim() }),
    ...(filter?.mile && { mile: filter.mile }),
    ...(filter?.state?.trim() && { state: filter.state.trim() }),
  };
  try {
    const { data, error } = await allOrders(newFilter);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const acceptOrder = async (orderId: string) => {
  try {
    const { data, error } = await accept(orderId);
    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const rejectOrder = async (orderId: string) => {
  try {
    const { data, error } = await reject(orderId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const bookOrder = async (orderId: string) => {
  try {
    const { data: isAvailableToBook, error: orderError } = await checkOrderAvailableToBook(orderId);

    if (!isAvailableToBook) {
      return responseDataWithValidationError(
        'Sorry, the order is already booked by another photographer.',
      );
    }
    if (orderError) {
      return responseDataWithApiError();
    }

    try {
      const { data, error } = await book(orderId);
      if (error) {
        return responseDataWithApiError();
      }

      const resData: ApiResponseData = {
        success: true,
        statusCode: HTTP_STATUS_CODES.OK,
        data: data,
      };

      return resData;
    } catch (error) {
      return responseDataWithUnknownError();
    }
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const myOrders = async (filter?: OrderFilter) => {
  if (!filter?.activeTab) {
    return responseDataWithValidationError('Invalid order category');
  }
  const newFilter = {
    ...(filter?.searchVal?.trim() && { searchVal: filter.searchVal.trim() }),
    ...(filter?.activeTab && { activeTab: filter.activeTab }),
  };

  try {
    const { data, error } = await getMyOrders(newFilter);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const removeOrder = async (orderId: string) => {
  try {
    const { data, error } = await softDeleteOrder(orderId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: data,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};
