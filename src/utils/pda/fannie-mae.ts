'use server';

import qs from 'qs';
import { createSupabaseServerClient } from '@/utils/supabase/server';

import { FANNIE_MAE_CONFIG } from './constants';

const FNM_AT_EXPIRES_IN = 299;
const FNM_AT_TIME_GAP = 60;
const FNM_RT_EXPIRES_IN = 7199;
const FNM_AT_TOKEN_STATUS = {
  STORING: 'storing',
  UPDATING: 'updating',
};

export const saveToken = async (data: IFnmAllTokensData): Promise<ITokensData> => {
  const supabase = createSupabaseServerClient();

  const updatedAt = Date.now();

  const tokensData = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    updatedAt,
    status: FNM_AT_TOKEN_STATUS.STORING,
  };

  const payload = {
    service: 'fannie-mae',
    data: tokensData,
  };

  await supabase
    .from('pda_auth')
    .upsert(payload)
    .select()
    .single()
    .then(({ data, error }) => {});

  return tokensData;
};

// getTokensDataFromRedis
export const getTokensData = async (): Promise<ITokensData> => {
  const supabase = createSupabaseServerClient();

  const result: ITokensData = await supabase
    .from('pda_auth')
    .select('data')
    .eq('service', 'fannie-mae')
    .single()
    .then(({ data, error }) => {
      if (error) {
        return {};
      } else {
        return data.data;
      }
    });

  const tokensData: ITokensData = {
    accessToken: result.accessToken || '',
    refreshToken: result.refreshToken || '',
    updatedAt: result.updatedAt || 0,
    status: result.status || '',
  };

  return tokensData;
};

export const calcTokensServiceData = async () => {
  const tokensData = await getTokensData();

  const currentDate = Date.now();
  const updatedAt = tokensData.updatedAt;
  const atExpiredAt = updatedAt + FNM_AT_EXPIRES_IN * 1000;
  const atShouldUpdateAt = atExpiredAt - FNM_AT_TIME_GAP * 1000;
  const rtExpiredAt = updatedAt + FNM_RT_EXPIRES_IN * 1000;

  const isAtLive = atExpiredAt > currentDate;
  const isRtLive = rtExpiredAt > currentDate;
  const isAtShouldBeUpdated = !(atShouldUpdateAt > currentDate);

  const atStatus = tokensData.status;
  const isAccessTokenUpdatingNow = atStatus === FNM_AT_TOKEN_STATUS.UPDATING;

  const expirationData = {
    isAccessTokenExpired: !isAtLive,
    isRefreshTokenExpired: !isRtLive,
    isAccessTokenShouldBeUpdated: isAtShouldBeUpdated,
    isAccessTokenUpdatingNow,
  };

  return expirationData;
};

export const createTokens = async (): Promise<IFnmAllTokensData> => {
  try {
    const stringifiedData = qs.stringify({
      grant_type: 'password',
      username: process.env.FANNIE_MAE_USERNAME || '',
      password: process.env.FANNIE_MAE_PASSWORD || '',
    });

    const res = await fetch(FANNIE_MAE_CONFIG.AUTH_URL, {
      method: 'POST',
      headers: {
        ...FANNIE_MAE_CONFIG.AUTH_HEADERS,
      },
      body: stringifiedData,
    });

    if (!res.ok) {
      throw new Error('create_token_error');
    }

    const fnmAllTokensData: IFnmAllTokensData = await res.json();

    return fnmAllTokensData;
  } catch (err) {
    throw err;
  }
};

// createAndSetToken
export const createAndSaveToken = async (): Promise<ITokensData> => {
  try {
    const fnmAllTokensData = await createTokens();
    const tokensData = await saveToken(fnmAllTokensData);

    return tokensData;
  } catch (err) {
    throw err;
  }
};

export const refreshToken = async (): Promise<IFnmAllTokensData> => {
  try {
    const tokensData: ITokensData = await getTokensData();

    if (!tokensData.refreshToken && !tokensData.accessToken) {
      throw new Error('invalid_grant');
    }

    const stringifiedData = qs.stringify({
      grant_type: 'refresh_token',
      refresh_token: tokensData.refreshToken,
    });

    const res = await fetch(FANNIE_MAE_CONFIG.AUTH_URL, {
      method: 'POST',
      headers: {
        ...FANNIE_MAE_CONFIG.AUTH_HEADERS,
      },
      body: stringifiedData,
    });

    if (!res.ok) {
      const err = await res.json();

      if (err.error === 'invalid_grant') {
        throw new Error('invalid_grant');
      } else {
        throw new Error('refresh_token_error');
      }
    }

    const fnmAccessTokenData: IFnmAccessTokenData = await res.json();

    const fnmAllTokensData: IFnmAllTokensData = {
      ...fnmAccessTokenData,
      refresh_token: tokensData.refreshToken,
    };

    return fnmAllTokensData;
  } catch (err) {
    throw err;
  }
};

export const refreshAndSetToken = async (): Promise<ITokensData> => {
  try {
    const fnmAllTokensData = await refreshToken().catch(async (err) => {
      if (err.message === 'invalid_grant') {
        const result = await createTokens();
        return result;
      }
      throw err;
    });

    const tokensData = await saveToken(fnmAllTokensData);

    return tokensData;
  } catch (err) {
    throw err;
  }
};

export const createInspection = async (report: any): Promise<IFnmPropertyRespose> => {
  try {
    const tokensData: ITokensData = await refreshAndSetToken();

    const headers = {
      Authorization: `Bearer ${tokensData.accessToken}`,
      ...FANNIE_MAE_CONFIG.PROPERTIES_DATA_HEADERS,
      ...FANNIE_MAE_CONFIG.PROPERTIES_X_FNMA_HEADERS,
      'x-fnma-access-token': tokensData.accessToken,
    };

    const res = await fetch(`${FANNIE_MAE_CONFIG.PROPERTIES_URL}/property`, {
      method: 'POST',
      headers,
      body: JSON.stringify(report),
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 400) {
      throw new Error('create_inspection_report_error');
    }

    return resData;
  } catch (err) {
    throw err;
  }
};

export const getInspectionStatus = async (inspectionId: string) => {
  try {
    const tokensData: ITokensData = await refreshAndSetToken();

    const headers = {
      Authorization: `Bearer ${tokensData.accessToken}`,
      ...FANNIE_MAE_CONFIG.PROPERTIES_X_FNMA_HEADERS,
      'x-fnma-access-token': tokensData.accessToken,
    };

    const res = await fetch(`${FANNIE_MAE_CONFIG.PROPERTIES_URL}/property/${inspectionId}/status`, {
      method: 'GET',
      headers,
    });

    const resData = await res.json();

    if (!res.ok && res.status !== 400) {
      throw new Error('create_inspection_report_error');
    }

    return resData;
  } catch (err) {
    throw err;
  }
};
