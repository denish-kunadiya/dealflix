export enum ERROR_CODES {
  PARAMETER_MISSING = 'parameter-missing',
  PARAMETER_INVALID = 'parameter-invalid',
  PARAMETER_MISSING_INVALID = 'parameter-missing-invalid',

  SERVER_WRONG = 'server-error',
}

export const ERROR_CODE_MSG = {
  [ERROR_CODES.PARAMETER_MISSING]: 'One or more required values are missing.',
  [ERROR_CODES.PARAMETER_INVALID]: 'One or more values are invalid.',
  [ERROR_CODES.PARAMETER_MISSING_INVALID]: 'One or more required values are missing or invalid.',

  [ERROR_CODES.SERVER_WRONG]: 'Something went wrong',
};

export enum ERROR_TYPES {
  INVALID_REQ_ERROR = 'invalid-request-error',
  API_ERROR = 'api-error',
}

export enum HTTP_STATUS_CODES {
  OK = 200,
  BAD_REQ = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  SERVER_ERR = 500,
}
