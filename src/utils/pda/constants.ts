const basicToken =
  'Basic ' +
  Buffer.from(
    process.env.FANNIE_MAE_CLIENT_ID! + ':' + process.env.FANNIE_MAE_CLIENT_SECRET!,
  ).toString('base64');

// TODO: update to production later
const FANNIE_MAE_PRODUCTION = {
  PROPERTIES_URL:
    'https://api-clve.fanniemae.com/singlefamily/originating/properties/property-data/api',
  PROPERTIES_X_FNMA_HEADERS: {
    'x-fnma-channel': 'api',
    'x-fnma-api-type': 'private',
    'x-fnma-api-key': process.env.FANNIE_MAE_API_KEY!,
  },
  PROPERTIES_DATA_HEADERS: {
    'Content-Type': 'application/pda.upd.sf.1+json',
  },
  PROPERTIES_IMAGE_UPLOAD_HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
  PROPERTIES_IMAGE_METADATA_HEADERS: {
    'Content-Type': 'application/json',
  },
  AUTH_URL: 'https://fmsso-api.fanniemae.com/as/token.oauth2',
  AUTH_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Authorization: basicToken,
  },
};

const FANNIE_MAE_DEVELOPMENT = {
  PROPERTIES_URL:
    'https://api-clve.fanniemae.com/singlefamily/originating/properties/property-data/api',
  PROPERTIES_X_FNMA_HEADERS: {
    'x-fnma-channel': 'api',
    'x-fnma-api-type': 'private',
    'x-fnma-api-key': process.env.FANNIE_MAE_API_KEY!,
  },
  PROPERTIES_DATA_HEADERS: {
    'Content-Type': 'application/pda.upd.sf.1+json',
  },
  PROPERTIES_IMAGE_UPLOAD_HEADERS: {
    'Content-Type': 'multipart/form-data',
  },
  PROPERTIES_IMAGE_METADATA_HEADERS: {
    'Content-Type': 'application/json',
  },
  AUTH_URL: 'https://fmsso-api.fanniemae.com/as/token.oauth2',
  AUTH_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Authorization: basicToken,
  },
};

export const FANNIE_MAE_CONFIG =
  process.env.NODE_ENV === 'production' ? FANNIE_MAE_PRODUCTION : FANNIE_MAE_DEVELOPMENT;

const FREDDIE_MAC_DEVELOPMENT = {
  PROPERTIES_URL:
    'https://api-test.freddiemac.com/single-family/loan-advisor-suite/las-beyondace-api/v2',
  AUTH_URL: 'https://api-test.freddiemac.com/oauth/v1/token',
  AUTH_HEADERS: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  PROPERTIES_DATA_HEADERS: {
    'Content-Type': 'application/json',
  },
  PROPERTIES_X_HEADERS: {
    'X-Amc-Id': process.env.FREDDIE_MAC_AMC_ID!,
    'X-Lender-Id': process.env.FREDDIE_MAC_LENDER_ID!, // TODO: update to production and dev later
    'X-LenderLoan-Id': '0501555332', // TODO: update to production and dev later
    'X-Dataset-Version': 'UPD1.1',
    'X-PropertyDataReportType': 'ACEPDR',
  },
};

export const FREDDIE_MAC_CONFIG =
  process.env.NODE_ENV === 'production' ? FREDDIE_MAC_DEVELOPMENT : FREDDIE_MAC_DEVELOPMENT;
