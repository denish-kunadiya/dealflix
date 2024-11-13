'use server';
import { ApiResponseData } from '@/types/api';
import { HTTP_STATUS_CODES } from '@/utils/api/constants';
import { responseDataWithApiError, responseDataWithUnknownError } from '@/utils/api/helpers';
import deleteImage from '@/utils/supabase/helpers/report-image-reserve/delete';
import getImages from '@/utils/supabase/helpers/report-image-reserve/get-images';
import getOrderImagesByGroup from '@/utils/supabase/helpers/report-image-reserve/get-order-by-image-group';
import getThumbs from '@/utils/supabase/helpers/report-image-reserve/get-thumb';
import { insert } from '@/utils/supabase/helpers/report-image-reserve/insert';
import { updateDescription } from '@/utils/supabase/helpers/report-image-reserve/update-description';

export const getReserveImages = async (orderId: string) => {
  try {
    const { error, data } = await getImages(orderId);
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

export const insertReserveImage = async (
  file: FormData,
  orderId: string,
  imageReserve: TypesOfImages,
  imageGroup: string,
  timeStamp: number,
) => {
  const fileData = file.get('file');
  try {
    const { error, data } = await insert(fileData, orderId, imageReserve, imageGroup, timeStamp);
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

export const getThumbnailImageUrls = async (orderId: string, imageGroup: string) => {
  try {
    const { error, data } = await getOrderImagesByGroup(orderId, imageGroup);
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

export const deleteOrderImage = async (imageInfo: IImageDelete) => {
  try {
    const { data, error } = await deleteImage(imageInfo);
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
export const getThumbnailImagesByImageGroup = async (orderId: string) => {
  try {
    const { data, error } = await getThumbs(orderId);
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

export const addImageComment = async (description: string, imageId: string) => {
  try {
    const { data, error } = await updateDescription(description, imageId);
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
