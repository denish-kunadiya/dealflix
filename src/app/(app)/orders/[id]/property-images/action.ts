'use server';
import { ApiResponseData } from '@/types/api';
import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import {
  responseDataWithApiError,
  responseDataWithUnknownError,
  responseDataWithValidationError,
} from '@/utils/api/helpers';
import getUserId from '@/utils/supabase/helpers/get-user-id';
import { deleteImage } from '@/utils/supabase/helpers/property-images/delete-image';
import { createPropertyImageFromReserve as createPropertyImageFromReserveHelper } from '@/utils/supabase/helpers/property-images/create-property-image-from-reserve';
import getOrderImages from '@/utils/supabase/helpers/property-images/get-order-images';
import { getReportbyOrderId } from '@/utils/supabase/helpers/property-images/get-report';
import { addPropertyImage } from '@/utils/supabase/helpers/property-images/add-property-image';
import {
  updatePropertyImageFnmStatus as updatePropertyImageFnmStatusHelper,
  updateRecord,
} from '@/utils/supabase/helpers/property-images/update';
import storeImage from '@/utils/supabase/helpers/property-images/store-image';
import { getInspectionStatus } from '@/utils/pda/fannie-mae';
import { updateReportStatusByOrderId as updateReportStatusByOrderIdHelper } from '@/utils/supabase/helpers/property-images/update-report';

export const getImages = async (orderId: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');
    const { data, error } = await getOrderImages(orderId);

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

export const getOrderReport = async (orderId: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');
    const { data } = await getReportbyOrderId(orderId);

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

export const updateReportStatusByOrderId = async (orderId: string, status: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');
    const { data } = await updateReportStatusByOrderIdHelper(orderId, status);

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

export const addPropertyImageData = async (
  imageData: IInsertPropertyImage,
  fileInfo: { timeStamp: number; fileExtension: string | undefined },
) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const fileName = `${imageData.order_id}/${userId}_${fileInfo.timeStamp}.${fileInfo.fileExtension}`;
    imageData.image_name = fileName;
    imageData.user_id = userId;
    const { data, error } = await addPropertyImage(imageData);

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
    return responseDataWithApiError();
  }
};

export const updatePropertyImage = async (
  id: string,
  fileInfo: { timeStamp: number; fileExtension: string | undefined },
  metadata: IMetaDataResponse,
  orderId: string,
) => {
  try {
    if (!id) return responseDataWithValidationError('Image not found');
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const fileName = `${orderId}/${userId}_${fileInfo.timeStamp}.${fileInfo.fileExtension}`;

    const { data, error } = await updateRecord(id, fileName, metadata);

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
    return responseDataWithApiError();
  }
};

export const deleteImageInReport = async (orderId: string, deleteData: IDeleteImage) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const { data, error } = await deleteImage(orderId, deleteData);

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

export const updatePropertyImageFnmStatus = async (id: string, status: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const { data, error } = await updatePropertyImageFnmStatusHelper(id, status);

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

export const uploadToBucket = async (file: FormData, timeStamp: number, orderId: string) => {
  if (!file) {
    responseDataWithValidationError('Image is missing');
  }
  try {
    const { error, data } = await storeImage(file, timeStamp, orderId);
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

export const createPropertyImageFromReserve = async (
  orderId: string,
  imageName: string,
  fileInfo: { timeStamp: number; fileExtension: string | undefined },
) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const fileName = `${orderId}/${userId}_${fileInfo.timeStamp}.${fileInfo.fileExtension}`;

    const { error, data } = await createPropertyImageFromReserveHelper(
      orderId,
      imageName,
      fileName,
    );
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

export const getReportStatus = async (inspectionId: string) => {
  try {
    const data = await getInspectionStatus(inspectionId);

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
