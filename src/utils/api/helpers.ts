import { nanoid } from 'nanoid';

import { ApiErrorData, ApiErrorDataForLogger, ApiError, ApiResponseData } from '@/types/api';
import { ERROR_CODE_MSG, HTTP_STATUS_CODES, ERROR_TYPES, ERROR_CODES } from './constants';

const genereateShortid = () => {
  try {
    const shortid = nanoid(11);
    return shortid;
  } catch (error) {
    return '';
  }
};

export const createErrorData = (errorData: ApiErrorData): ApiError => {
  return {
    shortid: genereateShortid(),
    type: errorData.type,
    code: errorData.code,
    message: ERROR_CODE_MSG[errorData.code],
    param: errorData.param,
    details: errorData.details,
  };
};

export const createAndLogErrorData = (errorData: ApiErrorDataForLogger): ApiError => {
  // TODO: implement logger and logs table
  // logger({
  //   activity: 'Error',
  //   shortid: errorData.shortid,
  //   method: errorData.method,
  //   details: errorData.loggerMsg,
  //   user_id: errorData.userId,
  //   path: errorData.path,
  // });

  return createErrorData(errorData);
};

export const responseDataWithValidationError = (details: any): ApiResponseData => {
  const resDataWithValidationError: ApiResponseData = {
    success: false,
    statusCode: HTTP_STATUS_CODES.BAD_REQ,
    error: createErrorData({
      type: ERROR_TYPES.INVALID_REQ_ERROR,
      code: ERROR_CODES.PARAMETER_MISSING_INVALID,
      details,
    }),
  };

  return resDataWithValidationError;
};

export const responseDataWithApiError = (): ApiResponseData => {
  const resDataWithApiError: ApiResponseData = {
    success: false,
    statusCode: HTTP_STATUS_CODES.SERVER_ERR,
    error: createErrorData({
      type: ERROR_TYPES.API_ERROR,
      code: ERROR_CODES.SERVER_WRONG,
    }),
  };

  return resDataWithApiError;
};

export const responseDataWithUnknownError = (): ApiResponseData => {
  const resData: ApiResponseData = {
    success: false,
    statusCode: HTTP_STATUS_CODES.SERVER_ERR,
  };

  return resData;
};
