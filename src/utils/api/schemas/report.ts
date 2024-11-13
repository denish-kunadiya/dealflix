import { z } from 'zod';

import {
  COLLECTION_TYPES,
  CONTACT_METHODS,
  PROPERTY_TYPES,
  PROPERTY_DATA_COLLECTOR_TYPES,
  LOT_SIZE_UNITS,
  LOCATION_DESCRIPTION_TYPES,
  VIEW_DESCRIPTION_TYPES,
  VIEW_QUALITIES,
  ADVERSE_TYPES,
  PROPERTY_IMPROVEMENT_TYPES,
  POOL_CONCERN_TYPES,
  NON_RESIDENTIAL_USE_TYPES,
  WATERFRONT_IMPROVEMENT_TYPES,
  ROAD_OWNERSHIP_TYPES,
  ELECTRICAL_TYPES,
  SEWER_TYPES,
  WATER_TYPES,
  GAS_TYPES,
  DATE_FORMAT,
  BUILDINGS_STRUCTURE_TYPES,
  BUILDINGS_ATTACHMENT_TYPES,
  BUILDINGS_FOUNDATION_TYPES,
  BUILDINGS_CONSTRUCTION_STATUS,
  BUILDINGS_CONSTRUCTION_TYPES,
  BUILDINGS_DESIGN,
  EXTERIOR_DEFICIENCY_NAMES,
  EXTERIOR_DEFICIENCY_TYPES,
  EXTERIOR_DEFICIENCY_DETAIL_FUNDATION,
  EXTERIOR_DEFICIENCY_DETAIL_EXTERIOR_WALLS,
  EXTERIOR_DEFICIENCY_DETAIL_ROOF_SURFACE,
  EXTERIOR_DEFICIENCY_DETAIL_GUTTERS_AND_DOWNSPUTS,
  EXTERIOR_DEFICIENCY_DETAIL_WINDOWS,
  EXTERIOR_UPDATED_COMPONENT,
  EXTERIOR_UPDATE_TYPE,
  EXTERIOR_UPDATE_TIMEFRAME,
  HEATING_TYPE,
  COOLING_TYPE,
  MECHANICAL_DEFICIENCY_NAME,
  MECHANICAL_DEFICIENCY_TYPE,
  MECHANICAL_UPDATE_COMPONENT,
  MECHANICAL_UPDATE_TYPE,
  MECHANICAL_UPDATE_TIMEFRAME,
  GARAGE_TYPE,
  GARAGE_DEFICIENCY_NAME,
  GARAGE_DEFICIENCY_TYPE,
  GARAGE_DEFICIENCY_DETAIL_FOUNDATION,
  GARAGE_DEFICIENCY_DETAIL_EXTERIOR_WALLS,
  GARAGE_DEFICIENCY_DETAIL_ROOF_SURFACE,
  GARAGE_DEFICIENCY_DETAIL_WINDOWS,
  GARAGE_DEFICIENCY_DETAIL_CEILING,
  GARAGE_DEFICIENCY_DETAIL_INTERIOR_WALLS,
  BELOW_GRADE_EXITS,
  ATTIC_ACCESS,
  ROOM_TYPE,
  FIXTURE_TYPE,
  ROOM_FEATURE_TYPE,
  INTERIOR_DEFICIENCY_NAME,
  INTERIOR_DEFICIENCY_TYPE,
  INTERIOR_DEFICIENCY_DETAIL_FLOORING,
  INTERIOR_DEFICIENCY_DETAIL_CEILING,
  INTERIOR_DEFICIENCY_DETAIL_WALLS,
  INTERIOR_UPDATED_COMPONENT,
  INTERIOR_UPDATE_TYPE,
  INTERIOR_UPDATE_TIMEFRAME,
} from './constants';

export const reportIdSchema = z.string().uuid();
export const orderIdSchema = z.string().uuid();

const serviceDataSchema = z.object({
  reportId: reportIdSchema,
  path: z.string().trim().min(1, { message: 'Required' }),
});

export const propertyDataCollectorContactsSchema = z.array(
  z.object({
    contactMethod: z.enum([...CONTACT_METHODS]),
    contactDetail: z.string().trim().min(1, { message: 'Required' }),
  }),
);

export const generalInfoSchema = z.object({
  collectionType: z.enum([...COLLECTION_TYPES]),
  caseFileID: z.union([z.string().trim(), z.literal('')]),
  lpaID: z.union([z.string().trim(), z.literal('')]),
  pdaSubmitterEntity: z.string().trim().min(1, { message: 'Required' }),
  propertyDataCollectorName: z.string().trim().min(1, { message: 'Required' }),
  pdaHyperLink: z
    .union([z.string().trim().url({ message: 'Invalid url' }), z.literal('')])
    .optional(),

  pdaCollectionEntity: z.string().trim().min(1, { message: 'Required' }),
  propertyDataCollectorType: z.enum([...PROPERTY_DATA_COLLECTOR_TYPES]), // This field must be auto-populated by the fulfillment vendor. The user should have no interaction with this field.

  dataCollectorAcknowledgement: z.boolean(),
  dataCollectionDate: z.string().trim().date('Invalid date. Format, should be YYYY-MM-DD'),

  propertyDataCollectorContacts: propertyDataCollectorContactsSchema,
});

export const updateReportGenralInfoSchema = z.object({
  reportId: reportIdSchema,
  payload: generalInfoSchema,
});

const latitudeLongitudeSchema = z.coerce
  .number()
  .refine((val) => /^\d+(\.\d{6,})?$/.test(Math.abs(val || 0)?.toString()), {
    message: 'Invalid gps coordinates',
  });

export const reportPropertySchema = z.object({
  propertyType: z.enum([...PROPERTY_TYPES]),
  propertyOccupied: z.boolean(),
  address: z.object({
    streetAddress: z.string().trim().min(1, { message: 'Required' }),
    unitNumber: z.union([z.string().trim().max(10, { message: 'Too long' }), z.literal('')]),
    county: z.string().trim().min(1, { message: 'Required' }),
    city: z.string().trim().min(1, { message: 'Required' }),
    state: z.string().trim().length(2, { message: 'Required' }),
    postalCode: z.string().trim().length(5, { message: 'Required' }),
  }),
  identification: z.object({
    gpsCoordinates: z.object({
      latitude: latitudeLongitudeSchema,
      longitude: latitudeLongitudeSchema,
    }),
  }),
});

export const updateReportPropertySchema = z.object({
  reportId: reportIdSchema,
  payload: reportPropertySchema,
});

const locationItemSchema = z.object({
  locationDescriptionType: z.enum([...LOCATION_DESCRIPTION_TYPES], { message: 'Required' }),
  locationDescriptionDetails: z.string().trim().min(1, { message: 'Required' }),
});

const locationSchema = z.object({
  locations: z.array(locationItemSchema).nonempty(),
});

export const locationObjSchema = z.object({
  location: locationSchema,
});

const viewItemSchema = z
  .object({
    viewDescriptionType: z.enum([...VIEW_DESCRIPTION_TYPES], { message: 'Required' }),
    viewQuality: z
      .union([z.enum([...VIEW_QUALITIES], { message: 'Required' }), z.literal('')])
      .optional(),
    viewDescriptionDetails: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.viewDescriptionType !== 'NONE_NOTABLE') {
      if (!data.viewQuality) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['viewQuality'],
        });
      }
      if (!data.viewDescriptionDetails) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['viewDescriptionDetails'],
        });
      }
    }
  });

const siteViewSchema = z.object({
  views: z.array(viewItemSchema).nonempty(),
});

export const siteViewObjSchema = z.object({
  siteView: siteViewSchema, // Required if propertyType is SF
});

const adverseSiteConditionsItemSchema = z
  .object({
    adverseType: z.enum([...ADVERSE_TYPES], { message: 'Required' }),
    adverseSiteConditionDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.adverseType !== 'NONE_OBSERVED') {
      if (!data.adverseSiteConditionDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['adverseSiteConditionDescription'],
        });
      }
    }
  });

const adverseSiteConditionsSchema = z.array(adverseSiteConditionsItemSchema).nonempty();

export const adverseSiteConditionsObjSchema = z.object({
  adverseSiteConditions: adverseSiteConditionsSchema,
});

const ingroundPoolConcernsItemSchema = z
  .object({
    ingroundPoolConcern: z.enum([...POOL_CONCERN_TYPES], { message: 'Required' }),
    ingroundPoolConcernDescription: z.union([
      z.string().trim().min(1, { message: 'Required' }),
      z.literal(''),
    ]),
  })
  .superRefine((data, ctx) => {
    if (data.ingroundPoolConcern !== 'NONE') {
      if (!data.ingroundPoolConcernDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['ingroundPoolConcernDescription'],
        });
      }
    }
  });

const ingroundPoolConcernsSchema = z.array(ingroundPoolConcernsItemSchema).nonempty();
export const ingroundPoolConcernsObjSchema = z.object({
  ingroundPoolConcerns: ingroundPoolConcernsSchema,
});
export type TIngroundPoolConcernsObjSchema = z.infer<typeof ingroundPoolConcernsObjSchema>;

export const propertyImprovementsItemSchema = z
  .object({
    propertyImprovementType: z.enum([...PROPERTY_IMPROVEMENT_TYPES], { message: 'Required' }),
    propertyImprovementDescription: z.union([
      z.string().trim().min(1, { message: 'Required' }),
      z.literal(''),
    ]),
    ingroundPoolConcerns: ingroundPoolConcernsSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (data.propertyImprovementType !== 'NONE') {
      if (!data.propertyImprovementDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['propertyImprovementDescription'],
        });
      }
    }

    if (data.propertyImprovementType === 'INGROUND_POOL') {
      if (!data.ingroundPoolConcerns) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['ingroundPoolConcerns'],
        });
      }
    }
  });

const propertyImprovementsSchema = z.array(propertyImprovementsItemSchema).nonempty();

export const propertyImprovementsObjSchema = z.object({
  propertyImprovements: propertyImprovementsSchema, // Required if propertyType is SF
});

const nonResidentialUsesItemSchema = z
  .object({
    nonResidentialUseType: z.enum([...NON_RESIDENTIAL_USE_TYPES], { message: 'Required' }),
    nonResidentialUseDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.nonResidentialUseType !== 'NONE_OBSERVED') {
      if (!data.nonResidentialUseDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['nonResidentialUseDescription'],
        });
      }
    }
  });

const nonResidentialUsesSchema = z.array(nonResidentialUsesItemSchema).nonempty(); // Required if propertyType is SF

export const nonResidentialUsesObjSchema = z.object({
  nonResidentialUses: nonResidentialUsesSchema,
});

const waterfrontSiteImprovementsItemSchema = z.object({
  waterfrontImprovementType: z.enum([...WATERFRONT_IMPROVEMENT_TYPES], { message: 'Required' }),
});

const waterfrontSiteImprovementsSchema = z.array(waterfrontSiteImprovementsItemSchema);

export const waterfrontSiteImprovementsObjSchema = z.object({
  waterfrontSiteImprovements: waterfrontSiteImprovementsSchema, // Required IF (/property/propertyType = SF AND /property/site/siteFeature/location/locations/locationDescriptionType = 'OCEAN_FRONT_BEACH' OR 'OCEAN_FRONT_NO_BEACH' OR 'INLAND_SALTWATER_FRONT_BEACH' OR 'INLAND_SALTWATER_FRONT_NO_BEACH' OR 'LAKE_FRONT_BEACH' OR 'LAKE_FRONT_NO_BEACH' OR 'SEASONAL_LAKE_FRONT' OR 'RIVER_CANAL_FRONT' )
});

export const siteFeatureSchema = locationObjSchema
  .merge(locationObjSchema)
  .merge(siteViewObjSchema)
  .merge(adverseSiteConditionsObjSchema)
  .merge(propertyImprovementsObjSchema)
  .merge(nonResidentialUsesObjSchema)
  .merge(waterfrontSiteImprovementsObjSchema)
  .superRefine((data, ctx) => {
    const waterfrontLocations = [
      'OCEAN_FRONT_BEACH',
      'OCEAN_FRONT_NO_BEACH',
      'INLAND_SALTWATER_FRONT_BEACH',
      'INLAND_SALTWATER_FRONT_NO_BEACH',
      'LAKE_FRONT_BEACH',
      'LAKE_FRONT_NO_BEACH',
      'SEASONAL_LAKE_FRONT',
      'RIVER_CANAL_FRONT',
    ];
    let isContainAtLeastOneWaterLocation = false;
    data.location.locations.forEach((location) => {
      if (waterfrontLocations.includes(location.locationDescriptionType)) {
        isContainAtLeastOneWaterLocation = true;
      }
    });
    if (isContainAtLeastOneWaterLocation) {
      if (!data.waterfrontSiteImprovements.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['waterfrontSiteImprovements'],
        });
      }
    }
  });

export const offSiteFeatureSchema = z.object({
  road: z
    .object({
      roadOwnershipType: z.enum([...ROAD_OWNERSHIP_TYPES], { message: 'Required' }),
      roadMaintainedIndicator: z.boolean().optional(),
      yearRoundAccessIndicator: z.boolean(),
    })
    .superRefine((data, ctx) => {
      if (['UNKNOWN', 'PRIVATE'].includes(data.roadOwnershipType)) {
        if (typeof data.roadMaintainedIndicator !== 'boolean') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Required',
            path: ['roadMaintainedIndicator'],
          });
        }
      }
    }),
});

const electricalServicesItemSchema = z
  .object({
    electricalType: z.enum([...ELECTRICAL_TYPES], { message: 'Required' }),
    offGridService: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (['SOLAR', 'GENERATOR', 'WIND', 'HYDRO_ELECTRIC'].includes(data.electricalType)) {
      if (typeof data.offGridService !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['offGridService'],
        });
      }
    }
  });

const sewerServicesItemSchema = z.object({
  sewerType: z.enum([...SEWER_TYPES], { message: 'Required' }),
});

const waterServicesItemSchema = z.object({
  waterType: z.enum([...WATER_TYPES], { message: 'Required' }),
});

const gasServicesItemSchema = z.object({
  gasType: z.enum([...GAS_TYPES], { message: 'Required' }),
});

export const siteUtilityShema = z.object({
  electricalServices: z.array(electricalServicesItemSchema).nonempty(),
  sewerServices: z.array(sewerServicesItemSchema).nonempty(),
  waterServices: z.array(waterServicesItemSchema).nonempty(),
  gasServices: z.array(gasServicesItemSchema).nonempty(),
});

export const reportSiteSchema = z
  .object({
    lot: z.object({
      lotSize: z.coerce.number({ invalid_type_error: 'Required number' }),
      lotSizeUnits: z.enum([...LOT_SIZE_UNITS], { message: 'Required' }),
    }), // Required if propertyType is SF
    siteFeature: siteFeatureSchema,
    offSiteFeature: offSiteFeatureSchema,
    siteUtility: siteUtilityShema,
  })
  .superRefine((data, ctx) => {
    let isRequired = false;
    const waterfrontLocationDescriptionTypes = [
      'OCEAN_FRONT_BEACH',
      'OCEAN_FRONT_NO_BEACH',
      'INLAND_SALTWATER_FRONT_BEACH',
      'INLAND_SALTWATER_FRONT_NO_BEACH',
      'LAKE_FRONT_BEACH',
      'LAKE_FRONT_NO_BEACH',
      'SEASONAL_LAKE_FRONT',
      'RIVER_CANAL_FRONT',
    ];
    data.siteFeature.location.locations.map((item) => {
      if (waterfrontLocationDescriptionTypes.includes(item.locationDescriptionType)) {
        isRequired = true;
      }
    });
    if (isRequired && !data.siteFeature.waterfrontSiteImprovements?.length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Required',
        path: ['siteFeature.waterfrontSiteImprovements'],
      });
    }
  });

export const updateReportSiteSchema = z.object({
  reportId: reportIdSchema,
  payload: reportSiteSchema,
});

export const exteriorDeficienciesItemSchema = z
  .object({
    exteriorDeficiencyName: z.enum([...EXTERIOR_DEFICIENCY_NAMES], { message: 'Required' }),
    exteriorDeficiencyType: z
      .enum([...EXTERIOR_DEFICIENCY_TYPES], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
    exteriorDeficiencyDetailFoundation: z
      .enum([...EXTERIOR_DEFICIENCY_DETAIL_FUNDATION], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName = 'FOUNDATION'
    exteriorDeficiencyDetailExteriorWalls: z
      .enum([...EXTERIOR_DEFICIENCY_DETAIL_EXTERIOR_WALLS], { message: 'Required' })
      .optional(),
    exteriorDeficiencyDetailRoofSurface: z
      .enum([...EXTERIOR_DEFICIENCY_DETAIL_ROOF_SURFACE], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName = 'ROOF'
    exteriorDeficiencyDetailGuttersAndDownspouts: z
      .enum([...EXTERIOR_DEFICIENCY_DETAIL_GUTTERS_AND_DOWNSPUTS], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName = GUTTERS_DOWNSPOUTS
    exteriorDeficiencyDetailWindows: z
      .enum([...EXTERIOR_DEFICIENCY_DETAIL_WINDOWS], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName = 'WINDOWS'
    exteriorDeficiencySeverity: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
    exteriorDeficiencyDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
  })
  .superRefine((data, ctx) => {
    if (data.exteriorDeficiencyName !== 'NONE_OBSERVED') {
      if (!data.exteriorDeficiencyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyType'],
        });
      }

      if (!data.exteriorDeficiencyDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDescription'],
        });
      }
    }

    if (data.exteriorDeficiencyName === 'FOUNDATION') {
      if (!data.exteriorDeficiencyDetailFoundation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailFoundation'],
        });
      }
    }

    if (data.exteriorDeficiencyName === 'EXTERIOR_WALLS') {
      if (!data.exteriorDeficiencyDetailExteriorWalls) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailExteriorWalls'],
        });
      }
    }

    if (data.exteriorDeficiencyName === 'ROOF') {
      if (!data.exteriorDeficiencyDetailRoofSurface) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailRoofSurface'],
        });
      }
    }

    if (data.exteriorDeficiencyName === 'GUTTERS_DOWNSPOUTS') {
      if (!data.exteriorDeficiencyDetailGuttersAndDownspouts) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailGuttersAndDownspouts'],
        });
      }
    }

    if (data.exteriorDeficiencyName === 'WINDOWS') {
      if (!data.exteriorDeficiencyDetailWindows) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailWindows'],
        });
      }
    }
  });

export const exteriorUpdatesItemSchema = z
  .object({
    exteriorUpdatedComponent: z.enum([...EXTERIOR_UPDATED_COMPONENT], { message: 'Required' }),
    exteriorUpdateType: z.enum([...EXTERIOR_UPDATE_TYPE], { message: 'Required' }).optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
    exteriorUpdateTimeframe: z
      .enum([...EXTERIOR_UPDATE_TIMEFRAME], { message: 'Required' })
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
    exteriorUpdateDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if /property/buildings/exteriorDeficiencies/exteriorDeficiencyName != ‘NONE_OBSERVED’
  })
  .superRefine((data, ctx) => {
    if (data.exteriorUpdatedComponent !== 'NONE_OBSERVED') {
      if (!data.exteriorUpdateType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorUpdateType'],
        });
      }

      if (!data.exteriorUpdateTimeframe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorUpdateTimeframe'],
        });
      }

      if (!data.exteriorUpdateDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorUpdateDescription'],
        });
      }
    }
  });

export const heatingSystemsItemSchema = z.object({
  heatingType: z.enum([...HEATING_TYPE], { message: 'Required' }),
});

export const heatingSystemsSchema = z
  .array(heatingSystemsItemSchema)
  .nonempty()
  .superRefine((data, ctx) => {
    if (data.length > 1) {
      data.forEach((item, index) => {
        if (item.heatingType === 'NO_HEAT') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Not compatible with other types',
            path: [`${index}.heatingType`],
          });
        }
      });
    }
  });

export const heatingSystemsObjSchema = z.object({
  heatingSystems: heatingSystemsSchema,
});

export const coolingSystemsItemSchema = z.object({
  coolingType: z.enum([...COOLING_TYPE], { message: 'Required' }),
});

export const coolingSystemsSchema = z
  .array(coolingSystemsItemSchema)
  .nonempty()
  .superRefine((data, ctx) => {
    if (data.length > 1) {
      data.forEach((item, index) => {
        if (item.coolingType === 'NONE') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Not compatible with other types',
            path: [`${index}.coolingType`],
          });
        }
      });
    }
  });

export const coolingSystemsObjSchema = z.object({
  coolingSystems: coolingSystemsSchema,
});

export const mechanicalDeficienciesItemSchema = z
  .object({
    mechanicalDeficiencyName: z.enum([...MECHANICAL_DEFICIENCY_NAME], { message: 'Required' }),
    mechanicalDeficiencyType: z
      .enum([...MECHANICAL_DEFICIENCY_TYPE], { message: 'Required' })
      .optional(), // Required if mechanicalDeficiencyName != ‘NONE_OBSERVED’
    mechanicalDeficiencySeverity: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required if mechanicalDeficiencyName != ‘NONE_OBSERVED’
    mechanicalDeficiencyDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if mechanicalDeficiencyName != ‘NONE_OBSERVED’
  })
  .superRefine((data, ctx) => {
    if (data.mechanicalDeficiencyName !== 'NONE_OBSERVED') {
      if (!data.mechanicalDeficiencyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['mechanicalDeficiencyType'],
        });
      }

      if (!data.mechanicalDeficiencyDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['mechanicalDeficiencyDescription'],
        });
      }
    }
  });

export const mechanicalDeficienciesSchema = z.array(mechanicalDeficienciesItemSchema).nonempty();

export const mechanicalDeficienciesObjSchema = z.object({
  mechanicalDeficiencies: mechanicalDeficienciesSchema,
});

export const mechanicalUpdatesItemSchema = z
  .object({
    mechanicalUpdateComponent: z.enum([...MECHANICAL_UPDATE_COMPONENT], { message: 'Required' }),
    mechanicalUpdateType: z.enum([...MECHANICAL_UPDATE_TYPE], { message: 'Required' }).optional(), // Required if mechanicalUpdatedComponent != NONE_OBSERVED
    mechanicalUpateTimeframe: z
      .enum([...MECHANICAL_UPDATE_TIMEFRAME], { message: 'Required' })
      .optional(), // Required if mechanicalUpdatedComponent != NONE_OBSERVED
    mechanicalUpdateDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if mechanicalUpdatedComponent != NONE_OBSERVED
  })
  .superRefine((data, ctx) => {
    if (data.mechanicalUpdateComponent !== 'NONE_OBSERVED') {
      if (!data.mechanicalUpdateType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['mechanicalUpdateType'],
        });
      }

      if (!data.mechanicalUpateTimeframe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['mechanicalUpateTimeframe'],
        });
      }

      if (!data.mechanicalUpdateDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['mechanicalUpdateDescription'],
        });
      }
    }
  });

export const mechanicalUpdatesSchema = z.array(mechanicalUpdatesItemSchema).nonempty();

export const mechanicalUpdatesObjSchema = z.object({
  mechanicalUpdates: mechanicalUpdatesSchema,
});

export const garageDeficienciesItemSchema = z
  .object({
    garageDeficiencyName: z.enum([...GARAGE_DEFICIENCY_NAME], { message: 'Required' }), // Required IF(/property/buildings/units/garages/garageType != NONE)
    garageDeficiencyType: z.enum([...GARAGE_DEFICIENCY_TYPE], { message: 'Required' }).optional(), // Required if garageDeficiencyName != NONE_OBSERVED
    garageDeficiencyDetailFoundation: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_FOUNDATION], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'FOUNDATION' )
    garageDeficiencyDetailExteriorWalls: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_EXTERIOR_WALLS], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'EXTERIOR_WALLS' )
    garageDeficiencyDetailRoofSurface: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_ROOF_SURFACE], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'ROOF' )
    garageDeficiencyDetailWindows: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_WINDOWS], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'WINDOWS' )
    garageDeficiencyDetailCeiling: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_CEILING], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'CEILING' )
    garageDeficiencyDetailInteriorWalls: z
      .enum([...GARAGE_DEFICIENCY_DETAIL_INTERIOR_WALLS], { message: 'Required' })
      .optional(), // Required IF ( /property/buildings/units/garages/garageDeficiencies/garageDeficiencyName = 'INTERIOR_WALLS' )
    garageDeficiencySeverity: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required if garageDeficiencyName != NONE_OBSERVED
    garageDeficiencyDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if garageDeficiencyName != NONE_OBSERVED
  })
  .superRefine((data, ctx) => {
    if (data.garageDeficiencyName !== 'NONE_OBSERVED') {
      if (!data.garageDeficiencyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyType'],
        });
      }

      if (!data.garageDeficiencyDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDescription'],
        });
      }
    }

    if (data.garageDeficiencyName === 'FOUNDATION') {
      if (!data.garageDeficiencyDetailFoundation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailFoundation'],
        });
      }
    }

    if (data.garageDeficiencyName === 'EXTERIOR_WALLS') {
      if (!data.garageDeficiencyDetailExteriorWalls) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailExteriorWalls'],
        });
      }
    }

    if (data.garageDeficiencyName === 'ROOF') {
      if (!data.garageDeficiencyDetailRoofSurface) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailRoofSurface'],
        });
      }
    }

    if (data.garageDeficiencyName === 'WINDOWS') {
      if (!data.garageDeficiencyDetailWindows) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailWindows'],
        });
      }
    }

    if (data.garageDeficiencyName === 'CEILING') {
      if (!data.garageDeficiencyDetailCeiling) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailCeiling'],
        });
      }
    }

    if (data.garageDeficiencyName === 'INTERIOR_WALLS') {
      if (!data.garageDeficiencyDetailInteriorWalls) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencyDetailInteriorWalls'],
        });
      }
    }
  });

export const garageDeficienciesSchema = z.array(garageDeficienciesItemSchema).nonempty().optional();

export const garageDeficienciesObjSchema = z.object({
  garageDeficiencies: garageDeficienciesSchema,
});

export const garagesItemSchema = z
  .object({
    garageType: z.enum([...GARAGE_TYPE], { message: 'Required' }), // Required IF ( /property/propertyType = SF or (/property/propertyType = CONDO & property/buildings/buildingDesign = ROWHOUSE_TOWNHOUSE or DETACHED OR OTHER))
    garageSpaceCount: z
      .union([
        z.coerce.number({ invalid_type_error: 'Required number' }).int().positive(),
        z.literal(''),
      ])
      .optional(), // Required IF(/property/buildings/units/garages/garageType != NONE)
    garageSpaceArea: z
      .union([
        z.coerce.number({ invalid_type_error: 'Required number' }).int().positive(),
        z.literal(''),
      ])
      .optional(), // Required IF(/property/buildings/units/garages/garageType != NONE)
    garageConversionIndicator: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required IF(/property/buildings/units/garages/garageType != NONE)
  })
  .merge(garageDeficienciesObjSchema)
  .superRefine((data, ctx) => {
    if (data.garageType !== 'NONE') {
      if (!data.garageSpaceCount) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageSpaceCount'],
        });
      }

      if (!data.garageSpaceArea) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageSpaceArea'],
        });
      }

      if (!data.garageDeficiencies?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['garageDeficiencies'],
        });
      }
    }
  });

export const roomFeaturesItemSchema = z.object({
  roomFeatureType: z.enum([...ROOM_FEATURE_TYPE], { message: 'Required' }),
});

export const roomFeaturesSchema = z
  .array(roomFeaturesItemSchema)
  .nonempty()
  .superRefine((data, ctx) => {
    if (data?.length && data?.length > 1) {
      data.forEach((item, index) => {
        if (item.roomFeatureType === 'NONE') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Not compatible with other types',
            path: [`${index}.roomFeatureType`],
          });
        }
      });
    }
  });

export const roomFeaturesObjSchema = z.object({
  roomFeatures: roomFeaturesSchema,
});

export const plumbingFixturesItemSchema = z.object({
  fixtureType: z.enum([...FIXTURE_TYPE], { message: 'Required' }),
});

export const plumbingFixturesSchema = z
  .array(plumbingFixturesItemSchema)
  .nonempty()
  .optional()
  .superRefine((data, ctx) => {
    if (data?.length && data?.length > 1) {
      data.forEach((item, index) => {
        if (item.fixtureType === 'NONE_OBSERVED') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Not compatible with other types',
            path: [`${index}.fixtureType`],
          });
        }
      });
    }
  });

export const plumbingFixturesObjSchema = z.object({
  plumbingFixtures: plumbingFixturesSchema,
});

export const interiorDeficienciesItemSchema = z
  .object({
    interiorDeficiencyName: z.enum([...INTERIOR_DEFICIENCY_NAME], { message: 'Required' }),
    interiorDeficiencyType: z
      .enum([...INTERIOR_DEFICIENCY_TYPE], { message: 'Required' })
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiorDeficiencyName != ‘NONE_OBSERVED’)
    interiorDeficiencyDetailFlooring: z
      .enum([...INTERIOR_DEFICIENCY_DETAIL_FLOORING], { message: 'Required' })
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiorDeficiencyName = ‘FLOORING’)
    interiorDeficiencyDetailCeiling: z
      .enum([...INTERIOR_DEFICIENCY_DETAIL_CEILING], { message: 'Required' })
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiordeficiencyName = ‘CEILING’)
    interiorDeficiencyDetailWalls: z
      .enum([...INTERIOR_DEFICIENCY_DETAIL_WALLS], { message: 'Required' })
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiordeficiencyName = ‘WALLS’)
    interiorDeficiencyDetailTubShowerSurround: z.coerce
      .boolean({ invalid_type_error: 'Required' })
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiordeficiencyName = ‘SHOWER_TUB_SURROUND’)
    interiorDeficiencySeverity: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/interiorDeficiencyName != ‘NONE_OBSERVED’)
    interiorDeficiencyDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required IF( /property/buildings/units/levels/rooms/interiorDeficiencies/deficiencyName != ‘NONE_OBSERVED’)
  })
  .superRefine((data, ctx) => {
    if (data.interiorDeficiencyName !== 'NONE_OBSERVED') {
      if (!data.interiorDeficiencyType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorDeficiencyType'],
        });
      }

      if (!data.interiorDeficiencyDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorDeficiencyDescription'],
        });
      }
    }

    if (data.interiorDeficiencyName === 'FLOORING') {
      if (!data.interiorDeficiencyDetailFlooring) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorDeficiencyDetailFlooring'],
        });
      }
    }

    if (data.interiorDeficiencyName === 'CEILING') {
      if (!data.interiorDeficiencyDetailCeiling) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorDeficiencyDetailCeiling'],
        });
      }
    }

    if (data.interiorDeficiencyName === 'WALLS') {
      if (!data.interiorDeficiencyDetailWalls) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['exteriorDeficiencyDetailRoofSurface'],
        });
      }
    }

    if (data.interiorDeficiencyName === 'SHOWER_TUB_SURROUND') {
      if (typeof data.interiorDeficiencyDetailTubShowerSurround !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorDeficiencyDetailTubShowerSurround'],
        });
      }
    }
  });

export const interiorDeficienciesSchema = z.array(interiorDeficienciesItemSchema).nonempty();

export const interiorDeficienciesObjSchema = z.object({
  interiorDeficiencies: interiorDeficienciesSchema,
});

export const interiorUpdatesItemSchema = z
  .object({
    interiorUpdatedComponent: z.enum([...INTERIOR_UPDATED_COMPONENT], { message: 'Required' }),
    interiorUpdateType: z.enum([...INTERIOR_UPDATE_TYPE], { message: 'Required' }).optional(), // Required if interiorDeficiencyName != ‘NONE_OBSERVED’
    interiorUpdateTimeframe: z
      .enum([...INTERIOR_UPDATE_TIMEFRAME], { message: 'Required' })
      .optional(), // Required if interiorDeficiencyName != ‘NONE_OBSERVED’
    interiorUpdateDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required if interiorDeficiencyName != ‘NONE_OBSERVED’
  })
  .superRefine((data, ctx) => {
    if (data.interiorUpdatedComponent !== 'NONE_OBSERVED') {
      if (!data.interiorUpdateType) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorUpdateType'],
        });
      }

      if (!data.interiorUpdateTimeframe) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorUpdateTimeframe'],
        });
      }

      if (!data.interiorUpdateDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['interiorUpdateDescription'],
        });
      }
    }
  });

export const interiorUpdatesSchema = z.array(interiorUpdatesItemSchema).nonempty();

export const interiorUpdatesObjSchema = z.object({
  interiorUpdates: interiorUpdatesSchema,
});

export const roomsItemSchema = z
  .object({
    roomType: z.enum([...ROOM_TYPE], { message: 'Required' }),
    otherRoomTypeDescription: z
      .union([z.string().trim().min(1, { message: 'Required' }), z.literal('')])
      .optional(), // Required IF(/property/buildings/units/levels/rooms/roomType = 'OTHER_ROOM')
    appliances: z
      .union([
        z.object({
          rangeOvenExists: z.coerce.boolean({ invalid_type_error: 'Required' }), // Required IF(/property/buildings/units/levels/rooms/appliances/rangeOvenExists = TRUE)
        }),
        z.record(z.never()),
      ])
      .optional(),
  })
  .merge(plumbingFixturesObjSchema)
  .merge(roomFeaturesObjSchema)
  .merge(interiorDeficienciesObjSchema)
  .merge(interiorUpdatesObjSchema)
  .superRefine((data, ctx) => {
    if (data.roomType === 'OTHER_ROOM') {
      if (!data.otherRoomTypeDescription) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['otherRoomTypeDescription'],
        });
      }
    }

    if (data.roomType === 'KITCHEN') {
      if (typeof data.appliances?.rangeOvenExists !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['rangeOvenExists'],
        });
      }
    }

    if (
      ['FULL_BATH', 'HALF_BATH', 'KITCHEN', 'BUTLERS_PANTRY', 'LAUNDRY_ROOM'].includes(
        data.roomType,
      )
    ) {
      if (!data.plumbingFixtures?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['plumbingFixtures'],
        });
      }
    }
  });

export const roomsSchema = z.array(roomsItemSchema).nonempty();

export const roomsObjSchema = z.object({
  rooms: roomsSchema,
});

export const garagesSchema = z.array(garagesItemSchema).nonempty();

export const garagesObjSchema = z.object({
  garages: garagesSchema,
});

export const levelsItemSchema = z
  .object({
    levelNumber: z.coerce.number({ invalid_type_error: 'Required number' }).int().nonnegative(),
    belowGrade: z.coerce.boolean({ invalid_type_error: 'Required' }),
    belowGradeExits: z.array(z.enum([...BELOW_GRADE_EXITS], { message: 'Required' })).optional(), // Required IF ( /property/buildings/units/levels/belowGrade  =  TRUE )
    levelLowCeiling: z.coerce.boolean({ invalid_type_error: 'Required' }),
    attic: z.coerce.boolean({ invalid_type_error: 'Required' }),
    atticAccess: z.enum([...ATTIC_ACCESS], { message: 'Required' }).optional(), // Required IF ( /property/buildings/units/levels/attic = 'TRUE' )
    atticAccessLocation: z.coerce.boolean({ invalid_type_error: 'Required' }).optional(), // Required IF ( /property/buildings/units/levels/attic = 'TRUE' )
    totalArea: z.coerce.number({ invalid_type_error: 'Required number' }).int().nonnegative(),
    finishedArea: z.coerce.number({ invalid_type_error: 'Required number' }).int().nonnegative(),
    nonStandardFinishedArea: z.coerce
      .number({ invalid_type_error: 'Required number' })
      .int()
      .nonnegative(),
  })
  .merge(roomsObjSchema)
  .superRefine((data, ctx) => {
    if (data.belowGrade) {
      if (!data.belowGradeExits?.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['belowGradeExits'],
        });
      }
    }

    if (data.attic) {
      if (!data.atticAccess) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['atticAccess'],
        });
      }
    }
  });

export const levelsSchema = z.array(levelsItemSchema).nonempty();

export const levelsObjSchema = z.object({
  levels: levelsSchema,
});

export const unitsItemSchema = z
  .object({
    aduIndicator: z.coerce.boolean({ invalid_type_error: 'Required' }), // Required if containsRooms = True
  })
  .merge(heatingSystemsObjSchema)
  .merge(coolingSystemsObjSchema)
  .merge(mechanicalDeficienciesObjSchema)
  .merge(mechanicalUpdatesObjSchema)
  .merge(garagesObjSchema)
  .merge(levelsObjSchema);

export const unitsSchema = z.array(unitsItemSchema).nonempty();

export const unitsObjSchema = z.object({
  units: unitsSchema,
});

export const exteriorUpdatesSchema = z.array(exteriorUpdatesItemSchema).nonempty();

export const exteriorUpdatesObjSchema = z.object({
  exteriorUpdates: z.array(exteriorUpdatesItemSchema).nonempty(),
});

export const exteriorDeficienciesSchema = z.array(exteriorDeficienciesItemSchema).nonempty();

export const exteriorDeficienciesObjSchema = z.object({
  exteriorDeficiencies: exteriorDeficienciesSchema,
});

export const buildingsItemSchema = z
  .object({
    structureType: z.enum([...BUILDINGS_STRUCTURE_TYPES], { message: 'Required' }), // Required if propertyType is SFs
    structureArea: z.coerce.number({ invalid_type_error: 'Required number' }).positive(), // Required if propertyType is SFs
    attachmentType: z.enum([...BUILDINGS_ATTACHMENT_TYPES], { message: 'Required' }), // Required if propertyType is SFs
    foundationType: z.array(z.enum([...BUILDINGS_FOUNDATION_TYPES], { message: 'Required' })), // Required IF(property/propertyType = 'SF'  or  /property/buildings/buildingDesign = ROWHOUSE_TOWNHOUSE and DETACHED)
    constructionStatus: z.enum([...BUILDINGS_CONSTRUCTION_STATUS], { message: 'Required' }),
    constructionType: z.enum([...BUILDINGS_CONSTRUCTION_TYPES], { message: 'Required' }), // Required if propertyType is SFs
    containsRooms: z.coerce.boolean({ invalid_type_error: 'Required' }),
    yearBuilt: z
      .union([
        z.coerce.number({ invalid_type_error: 'Required number' }).int().positive(),
        z.literal(''),
      ])
      .optional(), // Required IF(/property/propertyType = 'SF' and /property/buildings/structureType = 'DWELLING' or /property/propertyType = 'CONDO')
    yearBuiltEstimate: z.preprocess(
      (val) => (val === undefined ? false : val),
      z.boolean({ invalid_type_error: 'Required' }).optional(),
    ),
  })
  .merge(exteriorDeficienciesObjSchema)
  .merge(exteriorUpdatesObjSchema)
  .merge(unitsObjSchema)
  .superRefine((data, ctx) => {
    if (data.structureType === 'DWELLING') {
      if (!data.yearBuilt || typeof data.yearBuilt !== 'number') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['yearBuilt'],
        });
      }

      if (typeof data.yearBuiltEstimate !== 'boolean') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Required',
          path: ['yearBuiltEstimate'],
        });
      }
    }
  });

export const buildingsObjSchema = z.object({
  buildings: z.array(buildingsItemSchema).nonempty(),
});
export const reportBuildingsSchema = z.array(buildingsItemSchema).nonempty();

export const updateReportBuildingsSchema = z.object({
  reportId: reportIdSchema,
  payload: reportBuildingsSchema,
});

export const updateInteriorUpdatesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: interiorUpdatesItemSchema,
  }),
);

export const updateInteriorUpdatesSchema = serviceDataSchema.merge(
  z.object({
    payload: interiorUpdatesSchema,
  }),
);

export const updateInteriorDeficienciesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: interiorDeficienciesItemSchema,
  }),
);

export const updateInteriorDeficienciesSchema = serviceDataSchema.merge(
  z.object({
    payload: interiorDeficienciesSchema,
  }),
);

export const updateRoomFeaturesSchema = serviceDataSchema.merge(
  z.object({
    payload: roomFeaturesSchema,
  }),
);

export const updatePlumbingFixturesSchema = serviceDataSchema.merge(
  z.object({
    payload: plumbingFixturesSchema,
  }),
);

export const updateRoomsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: roomsItemSchema,
  }),
);

export const updateRoomsSchema = serviceDataSchema.merge(
  z.object({
    payload: roomsSchema,
  }),
);

export const updateLevelsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: levelsItemSchema,
  }),
);

export const updateLevelsSchema = serviceDataSchema.merge(
  z.object({
    payload: levelsSchema,
  }),
);

export const updateGarageDeficienciesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: garageDeficienciesItemSchema,
  }),
);

export const updateGarageDeficienciesSchema = serviceDataSchema.merge(
  z.object({
    payload: garageDeficienciesSchema,
  }),
);

export const updateGaragesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: garagesItemSchema,
  }),
);

export const updateGaragesSchema = serviceDataSchema.merge(
  z.object({
    payload: garagesSchema,
  }),
);

export const updateMechanicalUpdatesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: mechanicalUpdatesItemSchema,
  }),
);

export const updateMechanicalUpdatesSchema = serviceDataSchema.merge(
  z.object({
    payload: mechanicalUpdatesSchema,
  }),
);

export const updateMechanicalDeficienciesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: mechanicalDeficienciesItemSchema,
  }),
);

export const updateMechanicalDeficienciesSchema = serviceDataSchema.merge(
  z.object({
    payload: mechanicalDeficienciesSchema,
  }),
);

export const updateCoolingSystemsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: coolingSystemsItemSchema,
  }),
);

export const updateCoolingSystemsSchema = serviceDataSchema.merge(
  z.object({
    payload: coolingSystemsSchema,
  }),
);

export const updateHeatingSystemsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: heatingSystemsItemSchema,
  }),
);

export const updateHeatingSystemsSchema = serviceDataSchema.merge(
  z.object({
    payload: heatingSystemsSchema,
  }),
);

export const updateUnitsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: unitsItemSchema,
  }),
);

export const updateUnitsSchema = serviceDataSchema.merge(
  z.object({
    payload: unitsSchema,
  }),
);

export const updateExteriorUpdatesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: exteriorUpdatesItemSchema,
  }),
);

export const updateExteriorUpdatesSchema = serviceDataSchema.merge(
  z.object({
    payload: exteriorUpdatesSchema,
  }),
);

export const updateExteriorDeficienciesItemSchema = serviceDataSchema.merge(
  z.object({
    payload: exteriorDeficienciesItemSchema,
  }),
);

export const updateExteriorDeficienciesSchema = serviceDataSchema.merge(
  z.object({
    payload: exteriorDeficienciesSchema,
  }),
);

export const updateBuildingsItemSchema = serviceDataSchema.merge(
  z.object({
    payload: buildingsItemSchema,
  }),
);

export type TUpdateInteriorUpdatesItem = z.infer<typeof updateInteriorUpdatesItemSchema>;
export type TUpdateInteriorUpdates = z.infer<typeof updateInteriorUpdatesSchema>;
export type TUpdateInteriorDeficienciesItem = z.infer<typeof updateInteriorDeficienciesItemSchema>;
export type TUpdateInteriorDeficiencies = z.infer<typeof updateInteriorDeficienciesSchema>;
export type TUpdateRoomFeatures = z.infer<typeof updateRoomFeaturesSchema>;
export type TUpdatePlumbingFixtures = z.infer<typeof updatePlumbingFixturesSchema>;
export type TUpdateRoomsItem = z.infer<typeof updateRoomsItemSchema>;
export type TUpdateRooms = z.infer<typeof updateRoomsSchema>;
export type TUpdateLevelsItem = z.infer<typeof updateLevelsItemSchema>;
export type TUpdateLevels = z.infer<typeof updateLevelsSchema>;
export type TUpdateGarageDeficienciesItem = z.infer<typeof updateGarageDeficienciesItemSchema>;
export type TUpdateGarageDeficiencies = z.infer<typeof updateGarageDeficienciesSchema>;
export type TUpdateGaragesItem = z.infer<typeof updateGaragesItemSchema>;
export type TUpdateGarages = z.infer<typeof updateGaragesSchema>;
export type TUpdateMechanicalUpdatesItem = z.infer<typeof updateMechanicalUpdatesItemSchema>;
export type TUpdateMechanicalUpdates = z.infer<typeof updateMechanicalUpdatesSchema>;
export type TUpdateMechanicalDeficienciesItem = z.infer<
  typeof updateMechanicalDeficienciesItemSchema
>;
export type TUpdateMechanicalDeficiencies = z.infer<typeof updateMechanicalDeficienciesSchema>;
export type TUpdateCoolingSystemsItem = z.infer<typeof updateCoolingSystemsItemSchema>;
export type TUpdateCoolingSystems = z.infer<typeof updateCoolingSystemsSchema>;
export type TUpdateHeatingSystemsItem = z.infer<typeof updateHeatingSystemsItemSchema>;
export type TUpdateHeatingSystems = z.infer<typeof updateHeatingSystemsSchema>;
export type TUpdateUnitsItem = z.infer<typeof updateUnitsItemSchema>;
export type TUpdateUnits = z.infer<typeof updateUnitsSchema>;
export type TUpdateExteriorUpdatesItem = z.infer<typeof updateExteriorUpdatesItemSchema>;
export type TUpdateExteriorUpdates = z.infer<typeof updateExteriorUpdatesSchema>;
export type TUpdateExteriorDeficienciesItem = z.infer<typeof updateExteriorDeficienciesItemSchema>;
export type TUpdateExteriorDeficiencies = z.infer<typeof updateExteriorDeficienciesSchema>;
export type TUpdateBuildingsItem = z.infer<typeof updateBuildingsItemSchema>;

export type TUpdateReportBuildingsSchema = z.infer<typeof updateReportBuildingsSchema>;

export type TBuildingsObjSchema = z.infer<typeof buildingsObjSchema>;
export type TBuildingsSchema = z.infer<typeof reportBuildingsSchema>;
export type TBuildingsItemSchema = z.infer<typeof buildingsItemSchema>;
export type TExteriorDeficiencies = Pick<TBuildingsSchema[0], 'exteriorDeficiencies'>;
export type TExteriorDeficienciesItem = TBuildingsSchema[0]['exteriorDeficiencies'][0];
export type TExteriorUpdates = Pick<TBuildingsSchema[0], 'exteriorUpdates'>;
export type TExteriorUpdatesItem = TBuildingsSchema[0]['exteriorUpdates'][0];
export type TUnits = Pick<TBuildingsSchema[0], 'units'>;
export type TUnitsItem = TBuildingsSchema[0]['units'][0];
export type THeatingSystems = Pick<TUnitsItem, 'heatingSystems'>;
export type THeatingSystemsItem = THeatingSystems['heatingSystems'][0];
export type TCoolingSystems = Pick<TUnitsItem, 'coolingSystems'>;
export type TCoolingSystemsItem = TCoolingSystems['coolingSystems'][0];
export type TMechanicalDeficiencies = Pick<TUnitsItem, 'mechanicalDeficiencies'>;
export type TMechanicalDeficienciesItem = TMechanicalDeficiencies['mechanicalDeficiencies'][0];
export type TMechanicalUpdates = Pick<TUnitsItem, 'mechanicalUpdates'>;
export type TMechanicalUpdatesItem = TMechanicalUpdates['mechanicalUpdates'][0];
export type TGarages = Pick<TUnitsItem, 'garages'>;
export type TGaragesItem = TGarages['garages'][0];
export type TGarageDeficiencies = Pick<TGaragesItem, 'garageDeficiencies'>;
export type TGarageDeficienciesItem = z.infer<typeof garageDeficienciesItemSchema>;
export type TLevels = Pick<TUnitsItem, 'levels'>;
export type TLevelsItem = TLevels['levels'][0];
export type TRooms = Pick<TLevelsItem, 'rooms'>;
export type TRoomsItem = TRooms['rooms'][0];
export type TPlumbingFixtures = Pick<TRoomsItem, 'plumbingFixtures'>;
export type TPlumbingFixturesItem = z.infer<typeof plumbingFixturesItemSchema>;
export type TRoomFeatures = Pick<TRoomsItem, 'roomFeatures'>;
export type TRoomFeaturesItem = z.infer<typeof roomFeaturesItemSchema>;
export type TInteriorDeficiencies = Pick<TRoomsItem, 'interiorDeficiencies'>;
export type TInteriorDeficienciesItem = z.infer<typeof interiorDeficienciesItemSchema>;
export type TInteriorUpdates = Pick<TRoomsItem, 'interiorUpdates'>;
export type TInteriorUpdatesItem = z.infer<typeof interiorUpdatesItemSchema>;

export type TReportIdSchema = z.infer<typeof reportIdSchema>;

export type TGeneralInfoSchema = z.infer<typeof generalInfoSchema>;
export type TUpdateReportGenralInfoSchema = z.infer<typeof updateReportGenralInfoSchema>;

export type TReportPropertySchema = z.infer<typeof reportPropertySchema>;
export type TUpdateReportPropertySchema = z.infer<typeof updateReportPropertySchema>;

export type TReportSiteSchema = z.infer<typeof reportSiteSchema>;
export type TUpdateReportSiteSchema = z.infer<typeof updateReportSiteSchema>;

export type TLocation = Pick<TReportSiteSchema['siteFeature'], 'location'>;
export type TSiteView = Pick<TReportSiteSchema['siteFeature'], 'siteView'>;
export type TAdverseSiteConditions = Pick<
  TReportSiteSchema['siteFeature'],
  'adverseSiteConditions'
>;
export type TPropertyImprovements = Pick<TReportSiteSchema['siteFeature'], 'propertyImprovements'>;
export type TIngroundPoolConcernsState = TIngroundPoolConcernsObjSchema | undefined;
export type TNonResidentialUses = Pick<TReportSiteSchema['siteFeature'], 'nonResidentialUses'>;
export type TWaterfrontSiteImprovements = Pick<
  TReportSiteSchema['siteFeature'],
  'waterfrontSiteImprovements'
>;
export type TRoad = Pick<TReportSiteSchema['offSiteFeature'], 'road'>;
export type TElectricalServices = Pick<TReportSiteSchema['siteUtility'], 'electricalServices'>;
export type TSewerServices = Pick<TReportSiteSchema['siteUtility'], 'sewerServices'>;
export type TWaterServices = Pick<TReportSiteSchema['siteUtility'], 'waterServices'>;
export type TGasServices = Pick<TReportSiteSchema['siteUtility'], 'gasServices'>;
