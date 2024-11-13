'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import lodashCloneDeep from 'lodash/cloneDeep';
import lodashGet from 'lodash/get';
import lodashPick from 'lodash/pick';

import { PreventNavigation } from '@/components/ui/modals/prevent-navigation';
import {
  reportSiteSchema,
  TReportSiteSchema,
  TLocation,
  TSiteView,
  TAdverseSiteConditions,
  TPropertyImprovements,
  TNonResidentialUses,
  TWaterfrontSiteImprovements,
  TRoad,
  TElectricalServices,
  TSewerServices,
  TWaterServices,
  TGasServices,
  TIngroundPoolConcernsObjSchema,
} from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FormArrayControl from '../form-array-control';

import { LOT_SIZE_UNITS } from '@/utils/api/schemas/constants';

import { updateReportSite } from '@/app/(app)/orders/[id]/actions';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import SectionBreadcrumb from '../../section-breadcrumb';
import ReportSectionHeader from '../report-section-header';
import LocationsForm from './locations-form';
import ViewsForm from './views-form';
import AdverseSiteConditionsForm from './adverse-site-conditions-form';
import PropertyImprovementsForm from './property-improvements-form';
import IngroundPoolConcernsForm from './inground-pool-concerns-form';
import NonResidentialUsesForm from './non-residential-uses-from';
import WaterfrontImprovementsForm from './waterfront-site-improvements-form';
import RoadForm from './road-form';
import ElectricalServicesForm from './electrical-services-form';
import SewerServicesForm from './sewer-services-form';
import WaterServicesForm from './water-services-form';
import GasServicesForm from './gas-services-form';

import { SITE_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle } from '@/utils/reports/helpers';
import NavigationDrawer from '../navigation-drawer';
import { DrawerProvider } from '@/utils/hooks/use-navigation-drawer-context';

const STEP_DESCRIPTION = 'Step 3';

interface IPropertyForm {
  order: any;
  report: any;
}

type TIngroundPoolConcernsState = TIngroundPoolConcernsObjSchema | undefined;

const getFormDefaultValues = (data: TReportSiteSchema) => {
  return {
    lot: {
      lotSize: data?.lot?.lotSize || 0,
      lotSizeUnits: data?.lot?.lotSizeUnits || LOT_SIZE_UNITS[0],
    },
    siteFeature: {
      location: data?.siteFeature?.location,
      siteView: data?.siteFeature?.siteView,
      adverseSiteConditions: data?.siteFeature?.adverseSiteConditions,
      propertyImprovements: data?.siteFeature?.propertyImprovements,
      nonResidentialUses: data?.siteFeature?.nonResidentialUses,
      waterfrontSiteImprovements: data?.siteFeature?.waterfrontSiteImprovements || [],
    },
    offSiteFeature: {
      road: data?.offSiteFeature?.road,
    },
    siteUtility: {
      electricalServices: data?.siteUtility?.electricalServices,
      sewerServices: data?.siteUtility?.sewerServices,
      waterServices: data?.siteUtility?.waterServices,
      gasServices: data?.siteUtility?.gasServices,
    },
  };
};

const getIngroundPoolConcerns = (
  data?: TPropertyImprovements,
  index?: number,
): TIngroundPoolConcernsState => {
  const INITIAL_OBJECT_ITEM = {
    ingroundPoolConcern: 'NONE',
    ingroundPoolConcernDescription: '',
  } as TIngroundPoolConcernsObjSchema['ingroundPoolConcerns'][0];

  const ingroundPoolConcernsArray = lodashGet(
    data,
    `propertyImprovements.${index}.ingroundPoolConcerns`,
    [INITIAL_OBJECT_ITEM],
  ) as TIngroundPoolConcernsObjSchema['ingroundPoolConcerns'];

  if (!ingroundPoolConcernsArray?.length) return;

  return {
    ingroundPoolConcerns: ingroundPoolConcernsArray,
  };
};

const SiteForm = ({ order, report }: IPropertyForm) => {
  const router = useRouter();
  const [activeInnerSegment, setActiveInnerSegment] = useState(SITE_INNER_SEGMENT.MAIN);
  const [targetIndex, setTargetIndex] = useState<number>();

  const form = useForm<TReportSiteSchema>({
    resolver: zodResolver(reportSiteSchema),
    defaultValues: getFormDefaultValues(report?.inspection_report?.property?.site),
  });

  const isStoredByGSE = !!report?.fnm_inspection_id;

  const siteFeature = form.watch('siteFeature');
  const offSiteFeature = form.watch('offSiteFeature');
  const siteUtility = form.watch('siteUtility');

  const locationState = lodashPick(siteFeature, ['location']);
  const siteViewState = lodashPick(siteFeature, ['siteView']);
  const adverseSiteConditionState = lodashPick(siteFeature, ['adverseSiteConditions']);
  const propertyImprovementsState = lodashPick(siteFeature, ['propertyImprovements']);
  const nonResidentialUsesState = lodashPick(siteFeature, ['nonResidentialUses']);
  const waterfrontImprovementsState = lodashPick(siteFeature, ['waterfrontSiteImprovements']);
  const roadState = lodashPick(offSiteFeature, ['road']);
  const electricalServicesState = lodashPick(siteUtility, ['electricalServices']);
  const sewerServicesState = lodashPick(siteUtility, ['sewerServices']);
  const waterServicesState = lodashPick(siteUtility, ['waterServices']);
  const gasServicesState = lodashPick(siteUtility, ['gasServices']);

  const ingroundPoolConcerns = getIngroundPoolConcerns(propertyImprovementsState, targetIndex);

  const setLocationState = (data: TLocation) => {
    form.setValue('siteFeature.location', data.location, { shouldValidate: true });
  };
  const setSiteViewState = (data: TSiteView) => {
    form.setValue('siteFeature.siteView', data.siteView, { shouldValidate: true });
  };
  const setAdverseSiteConditionState = (data: TAdverseSiteConditions) => {
    form.setValue('siteFeature.adverseSiteConditions', data.adverseSiteConditions, {
      shouldValidate: true,
    });
  };
  const setPropertyImprovementsState = (data: TPropertyImprovements) => {
    form.setValue('siteFeature.propertyImprovements', data.propertyImprovements, {
      shouldValidate: true,
    });
  };
  const setNonResidentialUsesState = (data: TNonResidentialUses) => {
    form.setValue('siteFeature.nonResidentialUses', data.nonResidentialUses, {
      shouldValidate: true,
    });
  };
  const setWaterfrontImprovementsState = (data: TWaterfrontSiteImprovements) => {
    form.setValue('siteFeature.waterfrontSiteImprovements', data.waterfrontSiteImprovements, {
      shouldValidate: true,
    });
  };
  const setRoadState = (data: TRoad) => {
    form.setValue('offSiteFeature.road', data.road, { shouldValidate: true });
  };
  const setElectricalServicesState = (data: TElectricalServices) => {
    form.setValue('siteUtility.electricalServices', data.electricalServices, {
      shouldValidate: true,
    });
  };
  const setSewerServicesState = (data: TSewerServices) => {
    form.setValue('siteUtility.sewerServices', data.sewerServices, { shouldValidate: true });
  };
  const setWaterServicesState = (data: TWaterServices) => {
    form.setValue('siteUtility.waterServices', data.waterServices, { shouldValidate: true });
  };
  const setGasServicesState = (data: TGasServices) => {
    form.setValue('siteUtility.gasServices', data.gasServices, { shouldValidate: true });
  };

  const handleChangeIngroundPoolConcerns = (data: TIngroundPoolConcernsObjSchema) => {
    const index = targetIndex;
    if (typeof index !== 'number') return;

    const cloned = lodashCloneDeep(propertyImprovementsState);
    const targetItem = cloned?.propertyImprovements[index];

    if (!targetItem) return;

    targetItem.ingroundPoolConcerns = data.ingroundPoolConcerns;

    setPropertyImprovementsState(cloned);
    setTargetIndex(undefined);
  };

  const handleChangePropertyImprovements = (data: TPropertyImprovements, index?: number) => {
    setTargetIndex(index);
    setPropertyImprovementsState(data);
  };

  const onSubmit: SubmitHandler<TReportSiteSchema> = async (data) => {
    const reqPayload = {
      reportId: report.id,
      payload: data,
    };

    const result = await updateReportSite(reqPayload);

    if (result.success) {
      const nextUrl = `/orders/${order.id}/report/buildings`;
      form.reset();

      router.push(nextUrl);
      router.refresh();
      return;
    }

    if (result.error) {
      console.error(result.error);

      return;
    }
  };

  return (
    <>
      <DrawerProvider>
        <div className="mx-auto flex max-w-7xl flex-col items-center px-3 sm:px-6 lg:px-10">
          <div className="mb-[60px] w-full">
            <SectionBreadcrumb />
          </div>
          {activeInnerSegment === SITE_INNER_SEGMENT.MAIN && (
            <div className="w-full max-w-[612px] flex-col items-center">
              <header className="mb-[60px]">
                <ReportSectionHeader
                  title={calcInnerSegmentTitle(activeInnerSegment)}
                  description={STEP_DESCRIPTION}
                  variant="site"
                />
              </header>
              <main className="flex flex-col">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-10"
                  >
                    <FormDescription
                      variant="main"
                      className="pt-5"
                    >
                      Lot
                    </FormDescription>

                    <FormField
                      control={form.control}
                      name="lot.lotSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Size</FormLabel>
                          <FormControl>
                            <Input
                              disabled={isStoredByGSE}
                              placeholder="Enter information..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lot.lotSizeUnits"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Lot Size Units</FormLabel>
                          <Select
                            disabled={isStoredByGSE}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select value..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {LOT_SIZE_UNITS.map((value) => (
                                <SelectItem
                                  key={value}
                                  value={value}
                                >
                                  {value.replace(/_/g, ' ')}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <input
                      type="hidden"
                      {...form.register('siteFeature')}
                    />
                    <input
                      type="hidden"
                      {...form.register('offSiteFeature')}
                    />
                    <input
                      type="hidden"
                      {...form.register('siteUtility')}
                    />

                    <FormArrayControl
                      title="Locations"
                      errorMessage={form.formState.errors.siteFeature?.location ? 'Required' : ''}
                      description={
                        locationState?.location?.locations?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={locationState?.location?.locations?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.LOCATIONS);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.LOCATIONS);
                      }}
                    />

                    <FormArrayControl
                      title="Views"
                      errorMessage={form.formState.errors.siteFeature?.siteView ? 'Required' : ''}
                      description={
                        siteViewState?.siteView?.views?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={siteViewState?.siteView?.views?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.VIEWS);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.VIEWS);
                      }}
                    />

                    <FormArrayControl
                      title="Adverse Site Conditions"
                      errorMessage={
                        form.formState.errors.siteFeature?.adverseSiteConditions ? 'Required' : ''
                      }
                      description={
                        adverseSiteConditionState?.adverseSiteConditions?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={
                        adverseSiteConditionState?.adverseSiteConditions?.length ? 'edit' : 'add'
                      }
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ADVERSE_SITE_CONDITIONS);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ADVERSE_SITE_CONDITIONS);
                      }}
                    />

                    <FormArrayControl
                      title="Property Improvements"
                      errorMessage={
                        form.formState.errors.siteFeature?.propertyImprovements ? 'Required' : ''
                      }
                      description={
                        propertyImprovementsState?.propertyImprovements?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={
                        propertyImprovementsState?.propertyImprovements?.length ? 'edit' : 'add'
                      }
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.PROPERTY_IMPROVEMENTS);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.PROPERTY_IMPROVEMENTS);
                      }}
                    />

                    <FormArrayControl
                      title="Non Residential Uses"
                      errorMessage={
                        form.formState.errors.siteFeature?.nonResidentialUses ? 'Required' : ''
                      }
                      description={
                        nonResidentialUsesState?.nonResidentialUses?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={nonResidentialUsesState?.nonResidentialUses?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.NON_RESIDENTIAL_USES);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.NON_RESIDENTIAL_USES);
                      }}
                    />

                    <FormArrayControl
                      title="Waterfront Improvements"
                      errorMessage={
                        form.formState.errors.siteFeature?.waterfrontSiteImprovements
                          ? 'Required'
                          : ''
                      }
                      description={
                        waterfrontImprovementsState?.waterfrontSiteImprovements?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={
                        waterfrontImprovementsState?.waterfrontSiteImprovements?.length
                          ? 'edit'
                          : 'add'
                      }
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.WATERFRONT_IMPROVEMENTS);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.WATERFRONT_IMPROVEMENTS);
                      }}
                    />

                    <FormArrayControl
                      title="Road"
                      errorMessage={form.formState.errors.offSiteFeature?.road ? 'Required' : ''}
                      description={roadState?.road ? 'Edit information' : 'Add information'}
                      mode={roadState?.road ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ROAD);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ROAD);
                      }}
                    />

                    <FormArrayControl
                      title="Electrical Services"
                      errorMessage={
                        form.formState.errors.siteUtility?.electricalServices ? 'Required' : ''
                      }
                      description={
                        electricalServicesState?.electricalServices?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={electricalServicesState?.electricalServices?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ELECTRICAL_SERVICES);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.ELECTRICAL_SERVICES);
                      }}
                    />

                    <FormArrayControl
                      title="Sewer Services"
                      errorMessage={
                        form.formState.errors.siteUtility?.sewerServices ? 'Required' : ''
                      }
                      description={
                        sewerServicesState?.sewerServices?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={sewerServicesState?.sewerServices?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.SEWER_SERVICES);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.SEWER_SERVICES);
                      }}
                    />

                    <FormArrayControl
                      title="Water Services"
                      errorMessage={
                        form.formState.errors.siteUtility?.waterServices ? 'Required' : ''
                      }
                      description={
                        waterServicesState?.waterServices?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={waterServicesState?.waterServices?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.WATER_SERVICES);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.WATER_SERVICES);
                      }}
                    />

                    <FormArrayControl
                      title="Gas Services"
                      errorMessage={
                        form.formState.errors.siteUtility?.gasServices ? 'Required' : ''
                      }
                      description={
                        gasServicesState?.gasServices?.length
                          ? 'Edit information'
                          : 'Add information'
                      }
                      mode={gasServicesState?.gasServices?.length ? 'edit' : 'add'}
                      onAdd={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.GAS_SERVICES);
                      }}
                      onEdit={() => {
                        setActiveInnerSegment(SITE_INNER_SEGMENT.GAS_SERVICES);
                      }}
                    />

                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
                      <Button
                        variant="ghost"
                        asChild
                        disabled={form.formState.isSubmitting}
                        className="flex-1 basis-48"
                      >
                        <Link href={`/orders/${order.id}/report`}>Return to Report</Link>
                      </Button>
                      <Button
                        disabled={form.formState.isSubmitting || isStoredByGSE}
                        type="submit"
                        className="flex-1 basis-48"
                      >
                        Next
                      </Button>
                    </div>
                  </form>
                </Form>
              </main>
            </div>
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.LOCATIONS && (
            <LocationsForm
              stepDescription={STEP_DESCRIPTION}
              data={locationState}
              onSave={setLocationState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.VIEWS && (
            <ViewsForm
              stepDescription={STEP_DESCRIPTION}
              data={siteViewState}
              onSave={setSiteViewState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.ADVERSE_SITE_CONDITIONS && (
            <AdverseSiteConditionsForm
              stepDescription={STEP_DESCRIPTION}
              data={adverseSiteConditionState}
              onSave={setAdverseSiteConditionState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.PROPERTY_IMPROVEMENTS && (
            <PropertyImprovementsForm
              stepDescription={STEP_DESCRIPTION}
              data={propertyImprovementsState}
              onSave={handleChangePropertyImprovements}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.INGROUND_POOL_CONCERNS && (
            <IngroundPoolConcernsForm
              stepDescription={STEP_DESCRIPTION}
              data={ingroundPoolConcerns}
              onSave={handleChangeIngroundPoolConcerns}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.NON_RESIDENTIAL_USES && (
            <NonResidentialUsesForm
              stepDescription={STEP_DESCRIPTION}
              data={nonResidentialUsesState}
              onSave={setNonResidentialUsesState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.WATERFRONT_IMPROVEMENTS && (
            <WaterfrontImprovementsForm
              stepDescription={STEP_DESCRIPTION}
              data={waterfrontImprovementsState}
              onSave={setWaterfrontImprovementsState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.ROAD && (
            <RoadForm
              stepDescription={STEP_DESCRIPTION}
              data={roadState}
              onSave={setRoadState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.ELECTRICAL_SERVICES && (
            <ElectricalServicesForm
              stepDescription={STEP_DESCRIPTION}
              data={electricalServicesState}
              onSave={setElectricalServicesState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.SEWER_SERVICES && (
            <SewerServicesForm
              stepDescription={STEP_DESCRIPTION}
              data={sewerServicesState}
              onSave={setSewerServicesState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.WATER_SERVICES && (
            <WaterServicesForm
              stepDescription={STEP_DESCRIPTION}
              data={waterServicesState}
              onSave={setWaterServicesState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerSegment === SITE_INNER_SEGMENT.GAS_SERVICES && (
            <GasServicesForm
              stepDescription={STEP_DESCRIPTION}
              data={gasServicesState}
              onSave={setGasServicesState}
              onNextStep={setActiveInnerSegment}
              isViewMode={isStoredByGSE}
            />
          )}
        </div>
        <NavigationDrawer
          setActiveInnerSegment={setActiveInnerSegment}
          activeInnerSegment={activeInnerSegment}
          navigation={SITE_INNER_SEGMENT}
        />
        {!isStoredByGSE && <PreventNavigation isDirty />}
      </DrawerProvider>
    </>
  );
};

export default SiteForm;
