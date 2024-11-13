'use server';

import qs from 'qs';
import { createSupabaseServerClient } from '@/utils/supabase/server';

import { FREDDIE_MAC_CONFIG } from './constants';

const FMC_AT_TIME_GAP = 60;

export const saveToken = async (data: IFmcTokensData): Promise<IGeneralTokensData> => {
  const supabase = createSupabaseServerClient();

  const atExpiredAt =
    Number.parseInt(data.issued_at, 10) + Number.parseInt(data.expires_in, 10) * 1000;
  const rtExpiredAt =
    Number.parseInt(data.refresh_token_issued_at, 10) +
    Number.parseInt(data.refresh_token_expires_in, 10) * 1000;

  const tokensData = {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    atExpiredAt,
    rtExpiredAt,
  };

  const payload = {
    service: 'freddie-mac',
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

export const getTokensData = async (): Promise<IGeneralTokensData> => {
  const supabase = createSupabaseServerClient();

  const result: IGeneralTokensData = await supabase
    .from('pda_auth')
    .select('data')
    .eq('service', 'freddie-mac')
    .single()
    .then(({ data, error }) => {
      if (error) {
        return {};
      } else {
        return data.data;
      }
    });

  const tokensData: IGeneralTokensData = {
    accessToken: result.accessToken || '',
    refreshToken: result.refreshToken || '',
    atExpiredAt: result.atExpiredAt || 0,
    rtExpiredAt: result.rtExpiredAt || 0,
  };

  return tokensData;
};

export const calcTokensServiceData = async (): Promise<IExpirationData> => {
  const tokensData = await getTokensData();

  const currentDate = Date.now();
  const atShouldUpdateAt = tokensData.atExpiredAt - FMC_AT_TIME_GAP * 1000;

  const isAtLive = tokensData.atExpiredAt > currentDate;
  const isRtLive = tokensData.rtExpiredAt > currentDate;
  const isAtShouldBeUpdated = !(atShouldUpdateAt > currentDate);

  const expirationData: IExpirationData = {
    isAccessTokenExpired: !isAtLive,
    isRefreshTokenExpired: !isRtLive,
    isAccessTokenShouldBeUpdated: isAtShouldBeUpdated,
    tokensData: tokensData,
  };

  return expirationData;
};

export const createTokens = async (): Promise<IFmcTokensData> => {
  try {
    const stringifiedData = qs.stringify({
      grant_type: 'password',
      client_id: process.env.FREDDIE_MAC_CLIENT_ID || '',
      client_secret: process.env.FREDDIE_MAC_CLIENT_SECRET || '',
      username: process.env.FREDDIE_MAC_USERNAME || '',
      password: process.env.FREDDIE_MAC_PASSWORD || '',
    });

    const res = await fetch(FREDDIE_MAC_CONFIG.AUTH_URL, {
      method: 'POST',
      headers: {
        ...FREDDIE_MAC_CONFIG.AUTH_HEADERS,
      },
      body: stringifiedData,
    });

    if (!res.ok) {
      throw new Error('create_token_error');
    }

    const fmcAllTokensData: IFmcTokensData = await res.json();

    return fmcAllTokensData;
  } catch (err) {
    throw err;
  }
};

export const createAndSaveToken = async (): Promise<IGeneralTokensData> => {
  try {
    const fmcAllTokensData = await createTokens();
    const tokensData = await saveToken(fmcAllTokensData);

    return tokensData;
  } catch (err) {
    throw err;
  }
};

export const refreshToken = async (): Promise<IFmcTokensData> => {
  try {
    const tokensData: IGeneralTokensData = await getTokensData();

    if (!tokensData.refreshToken && !tokensData.accessToken) {
      throw new Error('invalid_grant');
    }

    const stringifiedData = qs.stringify({
      grant_type: 'refresh_token',
      client_id: process.env.FREDDIE_MAC_CLIENT_ID || '',
      client_secret: process.env.FREDDIE_MAC_CLIENT_SECRET || '',
      refresh_token: tokensData.refreshToken,
    });

    const res = await fetch(FREDDIE_MAC_CONFIG.AUTH_URL, {
      method: 'POST',
      headers: {
        ...FREDDIE_MAC_CONFIG.AUTH_HEADERS,
      },
      body: stringifiedData,
    });

    if (!res.ok) {
      const err = await res.json();

      if (err.code === '401.010') {
        // message: Refresh Token expired
        throw new Error('invalid_grant');
      } else {
        throw new Error('refresh_token_error');
      }
    }

    const fmcAllTokensData: IFmcTokensData = await res.json();

    return fmcAllTokensData;
  } catch (err) {
    throw err;
  }
};

export const refreshAndSetToken = async (): Promise<IGeneralTokensData> => {
  try {
    const fmcAllTokensData = await refreshToken().catch(async (err) => {
      if (err.message === 'invalid_grant') {
        const result = await createTokens();
        return result;
      }
      throw err;
    });

    const tokensData = await saveToken(fmcAllTokensData);

    return tokensData;
  } catch (err) {
    throw err;
  }
};

export const getValidAccessToken = async (): Promise<string> => {
  try {
    const expirationData = await calcTokensServiceData();

    if (!expirationData.isAccessTokenShouldBeUpdated && expirationData.tokensData?.accessToken) {
      return expirationData.tokensData.accessToken;
    }

    const tokensData = await refreshAndSetToken();

    return tokensData.accessToken;
  } catch (err) {
    throw err;
  }
};

export const createInspection = async (report: any): Promise<IFmcPropertyRespose> => {
  try {
    const accessToken = await getValidAccessToken();

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      ...FREDDIE_MAC_CONFIG.PROPERTIES_DATA_HEADERS,
      ...FREDDIE_MAC_CONFIG.PROPERTIES_X_HEADERS,
    };

    const res = await fetch(`${FREDDIE_MAC_CONFIG.PROPERTIES_URL}/property`, {
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
