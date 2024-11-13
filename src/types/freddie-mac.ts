interface IFmcTokensData {
  refresh_token_expires_in: string;
  refresh_token_status: string;
  api_product_list: string;
  UserName: string;
  api_product_list_json: string[];
  organization_name: string;
  token_type: string;
  issued_at: string;
  client_id: string;
  access_token: string;
  refresh_token: string;
  application_name: string;
  scope: string;
  refresh_token_issued_at: string;
  expires_in: string;
  refresh_count: string;
  status: string;
}

interface IGeneralTokensData {
  accessToken: string;
  refreshToken: string;
  atExpiredAt: number;
  rtExpiredAt: number;
}

interface IExpirationData {
  isAccessTokenExpired: boolean;
  isRefreshTokenExpired: boolean;
  isAccessTokenShouldBeUpdated: boolean;
  tokensData: IGeneralTokensData;
}

interface IFmcPropertyRespose {
  inspectionId: string | null;
  status: 'INCOMPLETE' | 'COMPLETE';
  validationErrors: IValidationError[] | null;
  requiredPhotos: IRequiredPhoto[] | null;
  missingImageFiles: any[] | null; // TODO: add type
  messages: any[] | null; // TODO: add type
}
