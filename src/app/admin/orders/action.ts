import { ApiResponseData } from '@/types/api';
import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import { responseDataWithApiError, responseDataWithUnknownError } from '@/utils/api/helpers';
import { assignToPhotographer } from '@/utils/supabase/helpers/admin/order/assign-order';
import { changeOrderStatus } from '@/utils/supabase/helpers/admin/order/change-order-status';
import { create } from '@/utils/supabase/helpers/admin/order/create-order';
import { deleteOrder } from '@/utils/supabase/helpers/admin/order/delete-order';
import { allOrders } from '@/utils/supabase/helpers/admin/order/get-all-orders';
import { photographers } from '@/utils/supabase/helpers/admin/order/get-photographers';
import { update } from '@/utils/supabase/helpers/admin/order/update-order';
import { getFilterOrder } from '@/utils/supabase/helpers/get-filter-order';

export const getAllOrders = async () => {
  try {
    const { data, error } = await allOrders();

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

export const changeStatus = async (orderId: string, status: string, assigneeId: string | null) => {
  try {
    const { data, error } = await changeOrderStatus(orderId, status, assigneeId);

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

export const deleteAdminOrder = async (orderId: string) => {
  try {
    const { data, error } = await deleteOrder(orderId);

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

export const getPhotographers = async () => {
  try {
    const { data, error } = await photographers();

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

export const assign = async (orderId: string, assignTo: string) => {
  try {
    const { data, error } = await assignToPhotographer(orderId, assignTo);

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

export const createAdminOrder = async (
  orderData: OrderData,
  location: { latitude: number; longitude: number },
) => {
  try {
    const { data, error } = await create(orderData, location);
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

export const updateAdminOrder = async (
  orderData: OrderData,
  location: { latitude: number; longitude: number },
) => {
  try {
    const { data, error } = await update(orderData, location);

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

export const filterAdminOrder = async (filter?: FilterOrder) => {
  try {
    const newFilter: FilterOrder = {
      ...(filter?.status && { status: filter.status }),
      ...(filter?.assignedId && { assignedId: filter.assignedId }),
      ...(filter?.onsiteContactName && { onsiteContactName: filter.onsiteContactName }),
      ...(filter?.onsiteContactPhone && { onsiteContactPhone: filter.onsiteContactPhone }),
      ...(filter?.createdAt && { createdAt: filter.createdAt }),
      ...(filter?.state && { state: filter.state }),
      ...(filter?.city && { city: filter.city }),
      ...(filter?.streetAddress && { streetAddress: filter.streetAddress }),
      ...(filter?.postalCode && { postalCode: filter.postalCode }),
      ...(filter?.floorsNumber && { floorsNumber: filter.floorsNumber }),
      ...(filter?.searchVal && { searchVal: filter.searchVal }),
    };
    const { data, error } = await getFilterOrder(newFilter);

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
