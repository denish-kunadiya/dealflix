'use server';

import _set from 'lodash/set';
import _cloneDeep from 'lodash/cloneDeep';

import {
  responseDataWithValidationError,
  responseDataWithApiError,
  responseDataWithUnknownError,
} from '@/utils/api/helpers';
import { ApiResponseData } from '@/types/api';
import { HTTP_STATUS_CODES } from '@/utils/api/constants';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '@/utils/supabase/helpers/get-user-id';
import getOrderByIdUtil from '@/utils/supabase/helpers/get-order-by-id';
import getReportById from '@/utils/supabase/helpers/get-report-by-id';
import { createInspection } from '@/utils/pda/fannie-mae';

import {
  reportIdSchema,
  orderIdSchema,
  updateReportGenralInfoSchema,
  TUpdateReportGenralInfoSchema,
  updateReportPropertySchema,
  updateReportSiteSchema,
  TUpdateReportPropertySchema,
  TUpdateReportSiteSchema,
  updateReportBuildingsSchema,
  TUpdateReportBuildingsSchema,
  TUpdateInteriorUpdatesItem,
  updateInteriorUpdatesItemSchema,
  TUpdateInteriorUpdates,
  updateInteriorUpdatesSchema,
  TUpdateInteriorDeficienciesItem,
  updateInteriorDeficienciesItemSchema,
  TUpdateInteriorDeficiencies,
  updateInteriorDeficienciesSchema,
  TUpdateRoomFeatures,
  updateRoomFeaturesSchema,
  TUpdateRoomsItem,
  updateRoomsItemSchema,
  TUpdateRooms,
  updateRoomsSchema,
  TUpdateLevelsItem,
  updateLevelsItemSchema,
  TUpdateLevels,
  updateLevelsSchema,
  TUpdateGaragesItem,
  updateGaragesItemSchema,
  TUpdateGarages,
  updateGaragesSchema,
  TUpdateMechanicalUpdatesItem,
  updateMechanicalUpdatesItemSchema,
  TUpdateMechanicalUpdates,
  updateMechanicalUpdatesSchema,
  TUpdateMechanicalDeficienciesItem,
  updateMechanicalDeficienciesItemSchema,
  TUpdateMechanicalDeficiencies,
  updateMechanicalDeficienciesSchema,
  TUpdateCoolingSystems,
  updateCoolingSystemsSchema,
  TUpdateHeatingSystems,
  updateHeatingSystemsSchema,
  TUpdateUnitsItem,
  updateUnitsItemSchema,
  TUpdateUnits,
  updateUnitsSchema,
  TUpdateExteriorUpdatesItem,
  updateExteriorUpdatesItemSchema,
  TUpdateExteriorUpdates,
  updateExteriorUpdatesSchema,
  TUpdateExteriorDeficienciesItem,
  updateExteriorDeficienciesItemSchema,
  TUpdateExteriorDeficiencies,
  updateExteriorDeficienciesSchema,
  TUpdateBuildingsItem,
  updateBuildingsItemSchema,
} from '@/utils/api/schemas/report';

export const getOrCreateReportForOrder = async (orderId: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = orderIdSchema.safeParse(orderId);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const { error, data } = await getOrderByIdUtil(orderId);

    if (error) {
      return responseDataWithApiError();
    }

    const report = data?.order?.report[0];

    if (report) {
      return {
        success: true,
        statusCode: HTTP_STATUS_CODES.OK,
        data: report,
      };
    }

    const supabase = createSupabaseServerClient();

    const { error: reportCreationError, data: reportData } = await supabase
      .from('report')
      .insert([{ order_id: orderId, user_id: userId }])
      .select('*')
      .single();

    if (reportCreationError) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
      data: reportData,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const getOrderById = async (id: string) => {
  try {
    const validatedFields = reportIdSchema.safeParse(id);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const { error, data } = await getOrderByIdUtil(id);

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

export const updateReportGenralInfo = async (data: TUpdateReportGenralInfoSchema) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateReportGenralInfoSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const {
      data: { report },
    } = await getReportById(data.reportId);

    const inspectionReportPayload = {
      ...(report.inspection_report || {}),
      ...data.payload,
      // propertyDataCollectorType: 'REAL_ESTATE_AGENT', // TODO: enable after send test cases, always send REAL_ESTATE_AGENT
    };

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('report')
      .update({ inspection_report: inspectionReportPayload })
      .eq('id', data.reportId)
      .eq('user_id', userId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateReportProperty = async (data: TUpdateReportPropertySchema) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateReportPropertySchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const {
      data: { report },
    } = await getReportById(data.reportId);

    const inspectionReportPayload = {
      ...(report.inspection_report || {}),
      property: {
        ...(report.inspection_report?.property || {}),
        ancillary: {
          alley: {},
          appliances: {},
          exterior: {},
          gas: {},
          interior: {},
        },
        address: data.payload.address,
        propertyType: data.payload.propertyType,
        propertyOccupied: data.payload.propertyOccupied,
        identification: data.payload.identification,
      },
    };

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('report')
      .update({ inspection_report: inspectionReportPayload })
      .eq('id', data.reportId)
      .eq('user_id', userId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateReportSite = async (data: TUpdateReportSiteSchema) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateReportSiteSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const {
      data: { report },
    } = await getReportById(data.reportId);

    const inspectionReportPayload = {
      ...(report.inspection_report || {}),
      property: {
        ...(report.inspection_report?.property || {}),
        site: {
          ...(report.inspection_report?.property?.site || {}),
          ...data.payload,
        },
      },
    };

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('report')
      .update({ inspection_report: inspectionReportPayload })
      .eq('id', data.reportId)
      .eq('user_id', userId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateReportBuildings = async (data: TUpdateReportBuildingsSchema) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateReportBuildingsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const {
      data: { report },
    } = await getReportById(data.reportId);

    const inspectionReportPayload = {
      ...(report.inspection_report || {}),
      property: {
        ...(report.inspection_report?.property || {}),
        buildings: [...(data.payload || [])],
      },
    };

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('report')
      .update({ inspection_report: inspectionReportPayload })
      .eq('id', data.reportId)
      .eq('user_id', userId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

const updateValidBuildingDataByPath = async <
  T extends {
    reportId: string;
    path: string;
    payload: any;
  },
>(
  data: T,
  userId: string,
) => {
  try {
    const {
      data: { report },
    } = await getReportById(data.reportId);

    const property = report.inspection_report.property || {};
    const newProperty = _cloneDeep(property);
    _set(newProperty, data.path, data.payload);

    const inspectionReportPayload = {
      ...(report.inspection_report || {}),
      property: {
        ...(newProperty || {}),
      },
    };

    const supabase = createSupabaseServerClient();

    const { error } = await supabase
      .from('report')
      .update({ inspection_report: inspectionReportPayload })
      .eq('id', data.reportId)
      .eq('user_id', userId);

    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateInteriorUpdatesItem = async (data: TUpdateInteriorUpdatesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateInteriorUpdatesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateInteriorUpdates = async (data: TUpdateInteriorUpdates) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateInteriorUpdatesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateInteriorDeficienciesItem = async (data: TUpdateInteriorDeficienciesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateInteriorDeficienciesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateInteriorDeficiencies = async (data: TUpdateInteriorDeficiencies) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateInteriorDeficienciesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateRoomFeatures = async (data: TUpdateRoomFeatures) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateRoomFeaturesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateRoomsItem = async (data: TUpdateRoomsItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateRoomsItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateRooms = async (data: TUpdateRooms) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateRoomsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateLevelsItem = async (data: TUpdateLevelsItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateLevelsItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateLevels = async (data: TUpdateLevels) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateLevelsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateGaragesItem = async (data: TUpdateGaragesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateGaragesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateGarages = async (data: TUpdateGarages) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateGaragesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateMechanicalUpdatesItem = async (data: TUpdateMechanicalUpdatesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateMechanicalUpdatesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateMechanicalUpdates = async (data: TUpdateMechanicalUpdates) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateMechanicalUpdatesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateMechanicalDeficienciesItem = async (data: TUpdateMechanicalDeficienciesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateMechanicalDeficienciesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateMechanicalDeficiencies = async (data: TUpdateMechanicalDeficiencies) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateMechanicalDeficienciesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateCoolingSystems = async (data: TUpdateCoolingSystems) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateCoolingSystemsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateHeatingSystems = async (data: TUpdateHeatingSystems) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateHeatingSystemsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateUnitsItem = async (data: TUpdateUnitsItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateUnitsItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateUnits = async (data: TUpdateUnits) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateUnitsSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateExteriorUpdatesItem = async (data: TUpdateExteriorUpdatesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateExteriorUpdatesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateExteriorUpdates = async (data: TUpdateExteriorUpdates) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateExteriorUpdatesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateExteriorDeficienciesItem = async (data: TUpdateExteriorDeficienciesItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateExteriorDeficienciesItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateExteriorDeficiencies = async (data: TUpdateExteriorDeficiencies) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateExteriorDeficienciesSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const updateBuildingsItem = async (data: TUpdateBuildingsItem) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    const validatedFields = updateBuildingsItemSchema.safeParse(data);

    if (!validatedFields.success) {
      return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    }

    const resData = await updateValidBuildingDataByPath(data, userId);

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};

export const sendIspectionReport = async (reportId: string) => {
  try {
    const userIdRes = await getUserId();
    const userId = userIdRes.data?.userId || null;

    if (!userId) return responseDataWithValidationError('User id not found');

    // TODO: add validation
    // const validatedFields = updateBuildingsItemSchema.safeParse(data);

    // if (!validatedFields.success) {
    //   return responseDataWithValidationError(validatedFields.error.flatten().fieldErrors);
    // }

    // const resData = await updateValidBuildingDataByPath(data, userId);

    const {
      data: { report },
    } = await getReportById(reportId);

    const inspection = await createInspection(report.inspection_report);

    const supabase = createSupabaseServerClient();
    const { error } = await supabase
      .from('report')
      .update({
        fnm_inspection_id: inspection.inspectionId,
        fnm_inspection_status: inspection.status,
        fnm_validation_errors: inspection.validationErrors,
        fnm_required_photos: inspection.requiredPhotos,
        fnm_missing_image_files: inspection.missingImageFiles,
      })
      .eq('id', reportId)
      .eq('user_id', userId);
    if (error) {
      return responseDataWithApiError();
    }

    const resData: ApiResponseData = {
      success: true,
      statusCode: HTTP_STATUS_CODES.OK,
    };

    return resData;
  } catch (error) {
    return responseDataWithUnknownError();
  }
};
