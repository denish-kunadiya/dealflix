interface IFnmAccessTokenData {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface IFnmAllTokensData extends IFnmAccessTokenData {
  refresh_token: string;
}

interface ITokensData {
  accessToken: string;
  refreshToken: string;
  updatedAt: number;
  status: string; // TODO: while this is not necessary, it may be worth deleting
}

interface IPdaAuth {
  id: number;
  service: TPdaService;
  data: ITokensData;
  created_at: Date;
  updated_at: Date;
}

interface IValidationError {
  jsonPath: string;
  validationErrorMessage: string;
}

interface IRequiredPhoto {
  inspectionId: string;
  photoType: string;
  description: string | null;
  photoTags: string | null;
  geoPosition: string | null;
  timestamp: string | null;
  photoNotAvailable: boolean;
  alwaysRequired: boolean;
  parentObjectJsonPath: string;
}

interface IFnmPropertyRespose {
  inspectionId: string | null;
  status: 'INCOMPLETE' | 'COMPLETE';
  validationErrors: IValidationError[] | null;
  requiredPhotos: IRequiredPhoto[] | null;
  missingImageFiles: any[] | null; // TODO: add type
  messages: any[] | null; // TODO: add type
}
