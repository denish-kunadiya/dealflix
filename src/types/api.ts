import { ERROR_CODES, ERROR_TYPES } from '@/utils/api/constants';

export interface ApiErrorData {
  type: ERROR_TYPES;
  code: ERROR_CODES;
  param?: string;
  details?: any;
}

export interface ApiError extends ApiErrorData {
  shortid: string;
  message: string;
}

export interface ApiErrorDataForLogger extends ApiErrorData {
  shortid: string;
  method: string;
  loggerMsg: string;
  path: string;
  userId?: number;
}

export interface ApiResponseData {
  success: boolean;
  statusCode: number;
  data?: any;
  error?: ApiError;
}
