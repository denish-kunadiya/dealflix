'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import _get from 'lodash/get';

import {
  TBuildingsObjSchema,
  TBuildingsItemSchema,
  buildingsObjSchema,
  TExteriorDeficiencies,
  TExteriorDeficienciesItem,
  TExteriorUpdates,
  TExteriorUpdatesItem,
  TUnits,
  TUnitsItem,
  THeatingSystems,
  TCoolingSystems,
  TMechanicalDeficiencies,
  TMechanicalDeficienciesItem,
  TMechanicalUpdates,
  TMechanicalUpdatesItem,
  TGarages,
  TGaragesItem,
  TGarageDeficiencies,
  TGarageDeficienciesItem,
  TLevels,
  TLevelsItem,
  TRooms,
  TRoomsItem,
  TPlumbingFixtures,
  TRoomFeatures,
  TInteriorDeficiencies,
  TInteriorDeficienciesItem,
  TInteriorUpdates,
  TInteriorUpdatesItem,
} from '@/utils/api/schemas/report';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Form } from '@/components/ui/form';
import FormArrayControl from '../form-array-control';
import { PreventNavigation } from '@/components/ui/modals/prevent-navigation';

import BuildingsItemForm from './buildings-item-form';
import ExteriorDeficienciesForm from './exterior-deficiencies-form';
import ExteriorDeficienciesItemForm from './exterior-deficiencies-item-form';
import ExteriorUpdatesForm from './exterior-updates-form';
import ExteriorUpdatesItemForm from './exterior-updates-item-form';
import UnitsForm from './units-form';
import UnitsItemForm from './units-item-form';
import HeatingSystemsForm from './heating-systems-form';
import CoolingSystemsForm from './cooling-systems-form';
import MechanicalDeficienciesForm from './mechanical-deficiencies-form';
import MechanicalDeficienciesItemForm from './mechanical-deficiencies-item-form';
import MechanicalUpdatesForm from './mechanical-updates-form';
import MechanicalUpdatesItemForm from './mechanical-updates-item-form';
import GaragesForm from './garages-form';
import GaragesItemForm from './garages-item-form';
import GarageDeficienciesForm from './garage-deficiencies-form';
import GarageDeficienciesItemForm from './garage-deficiencies-item-form';
import LevelsForm from './levels-form';
import LevelsItemForm from './levels-item-form';
import RoomsForm from './rooms-form';
import RoomsItemForm from './rooms-item-form';
import PlumbingFixturesForm from './plumbing-fixtures-form';
import RoomFeaturesForm from './room-features-form';
import InteriorDeficienciesForm from './interior-deficiencies-form';
import InteriorDeficienciesItemForm from './interior-deficiencies-item-form';
import InteriorUpdatesForm from './interior-updates-form';
import InteriorUpdatesItemForm from './interior-updates-item-form';

import {
  updateReportBuildings,
  updateInteriorUpdatesItem,
  updateInteriorUpdates,
  updateInteriorDeficienciesItem,
  updateInteriorDeficiencies,
  updateRoomFeatures,
  updateRoomsItem,
  updateRooms,
  updateLevelsItem,
  updateLevels,
  updateGaragesItem,
  updateGarages,
  updateMechanicalUpdatesItem,
  updateMechanicalUpdates,
  updateMechanicalDeficienciesItem,
  updateMechanicalDeficiencies,
  updateCoolingSystems,
  updateHeatingSystems,
  updateUnitsItem,
  updateUnits,
  updateExteriorUpdatesItem,
  updateExteriorUpdates,
  updateExteriorDeficienciesItem,
  updateExteriorDeficiencies,
  updateBuildingsItem,
} from '@/app/(app)/orders/[id]/actions';

import SectionBreadcrumb from '../../section-breadcrumb';
import ReportSectionHeader from '../report-section-header';

import { BUILDINGS_INNER_SEGMENT } from '@/utils/reports/constants';
import { calcInnerSegmentTitle, calcArrayItemTitle } from '@/utils/reports/helpers';
import NavigationDrawer from '../navigation-drawer';
import { DrawerProvider } from '@/utils/hooks/use-navigation-drawer-context';

const STEP_DESCRIPTION = 'Step 4';

interface IBuildingsForm {
  order: any;
  report: any;
}

const getFormDefaultValues = (data: TBuildingsObjSchema) => {
  return {
    buildings: data?.buildings,
  };
};

const BuildingsForm = ({ order, report }: IBuildingsForm) => {
  const router = useRouter();
  const [activeInnerSegment, setActiveInnerSegment] = useState(BUILDINGS_INNER_SEGMENT.MAIN);
  const [activeInnerPath, setActiveInnerPath] = useState<string>('');
  const [isPartiallyFilled, setIsPartiallyFilled] = useState(false);
  const [tempPath, setTempPath] = useState(BUILDINGS_INNER_SEGMENT.MAIN);
  const [isFromDrawer, setIsFromDrawer] = useState(false);
  useEffect(() => {
    if (tempPath && isFromDrawer) {
      setActiveInnerSegment(tempPath);
    }
    return () => {
      setTempPath(BUILDINGS_INNER_SEGMENT.MAIN);
      setIsFromDrawer(false);
    };
  }, [activeInnerPath, tempPath, isFromDrawer]);

  const form = useForm<TBuildingsObjSchema>({
    resolver: zodResolver(buildingsObjSchema),
    defaultValues: getFormDefaultValues(report?.inspection_report?.property),
  });

  const isStoredByGSE = !!report?.fnm_inspection_id;

  useEffect(() => {
    const isPartiallyFilledLocal = !!report?.inspection_report?.property?.buildings?.length;
    if (isPartiallyFilledLocal) {
      form.trigger();
      setIsPartiallyFilled(true);
    }
  }, [report?.inspection_report?.property, form, setIsPartiallyFilled]);

  const onSubmit: SubmitHandler<TBuildingsObjSchema> = async (data) => {
    const reqPayload = {
      reportId: report.id,
      payload: data.buildings,
    };

    const result = await updateReportBuildings(reqPayload);

    if (result.success) {
      const nextUrl = `/orders/${order.id}/report`;
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

  const controlBasePathName = 'buildings';
  const fieldsArray = useFieldArray({
    control: form.control,
    name: controlBasePathName,
  });

  const buildings = form.watch('buildings');
  const buildingsState = { buildings };
  const activeSegmentState = _get(buildingsState, activeInnerPath);

  const setBuildingsItem = async (data: TBuildingsItemSchema, path: string) => {
    const result = await updateBuildingsItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}`, data);

    return result.success;
  };

  const setExteriorDeficiencies = async (data: TExteriorDeficiencies, path: string) => {
    const result = await updateExteriorDeficiencies({
      reportId: report.id,
      path: path,
      payload: data.exteriorDeficiencies,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.exteriorDeficiencies`, data.exteriorDeficiencies);

    return result.success;
  };

  const setExteriorDeficienciesItem = async (data: TExteriorDeficienciesItem, path: string) => {
    const result = await updateExteriorDeficienciesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.exteriorDeficiencies.${number}`, data);

    return result.success;
  };

  const setExteriorUpdates = async (data: TExteriorUpdates, path: string) => {
    const result = await updateExteriorUpdates({
      reportId: report.id,
      path: path,
      payload: data.exteriorUpdates,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.exteriorUpdates`, data.exteriorUpdates);

    return result.success;
  };

  const setExteriorUpdatesItem = async (data: TExteriorUpdatesItem, path: string) => {
    const result = await updateExteriorUpdatesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.exteriorUpdates.${number}`, data);

    return result.success;
  };

  const setUnits = async (data: TUnits, path: string) => {
    const result = await updateUnits({
      reportId: report.id,
      path: path,
      payload: data.units,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units`, data.units);

    return result.success;
  };

  const setUnitsItem = async (data: TUnitsItem, path: string) => {
    const result = await updateUnitsItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}`, data);

    return result.success;
  };

  const setHeatingSystems = async (data: THeatingSystems, path: string) => {
    const result = await updateHeatingSystems({
      reportId: report.id,
      path: path,
      payload: data.heatingSystems,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.heatingSystems`,
      data.heatingSystems,
    );

    return result.success;
  };

  const setCoolingSystems = async (data: TCoolingSystems, path: string) => {
    const result = await updateCoolingSystems({
      reportId: report.id,
      path: path,
      payload: data.coolingSystems,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.coolingSystems`,
      data.coolingSystems,
    );

    return result.success;
  };

  const setMechanicalDeficiencies = async (data: TMechanicalDeficiencies, path: string) => {
    const result = await updateMechanicalDeficiencies({
      reportId: report.id,
      path: path,
      payload: data.mechanicalDeficiencies,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.mechanicalDeficiencies`,
      data.mechanicalDeficiencies,
    );

    return result.success;
  };

  const setMechanicalDeficienciesItem = async (data: TMechanicalDeficienciesItem, path: string) => {
    const result = await updateMechanicalDeficienciesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.mechanicalDeficiencies.${number}`,
      data,
    );

    return result.success;
  };

  const setMechanicalUpdates = async (data: TMechanicalUpdates, path: string) => {
    const result = await updateMechanicalUpdates({
      reportId: report.id,
      path: path,
      payload: data.mechanicalUpdates,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.mechanicalUpdates`,
      data.mechanicalUpdates,
    );

    return result.success;
  };

  const setMechanicalUpdatesItem = async (data: TMechanicalUpdatesItem, path: string) => {
    const result = await updateMechanicalUpdatesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}.mechanicalUpdates.${number}`, data);

    return result.success;
  };

  const setGarages = async (data: TGarages, path: string) => {
    const result = await updateGarages({
      reportId: report.id,
      path: path,
      payload: data.garages,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}.garages`, data.garages);

    return result.success;
  };

  const setGaragesItem = async (data: TGaragesItem, path: string) => {
    const result = await updateGaragesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}.garages.${number}`, data);

    return result.success;
  };

  const setGarageDeficiencies = (data: TGarageDeficiencies, path: string) => {
    /**
     * Don't add intermediate data save
     * because this is an optional field and depends on a condition at a higher data level
     * Must be saved together with the parent data level, otherwise there will be errors during data validation
     */

    form.setValue(
      path as `buildings.${number}.units.${number}.garages.${number}.garageDeficiencies`,
      data.garageDeficiencies,
    );
  };

  const setGarageDeficienciesItem = (data: TGarageDeficienciesItem, path: string) => {
    /**
     * Don't add intermediate data save
     * because this is an optional field and depends on a condition at a higher data level
     * Must be saved together with the parent data level, otherwise there will be errors during data validation
     */

    form.setValue(
      path as `buildings.${number}.units.${number}.garages.${number}.garageDeficiencies.${number}`,
      data,
    );
  };

  const setLevels = async (data: TLevels, path: string) => {
    const result = await updateLevels({
      reportId: report.id,
      path: path,
      payload: data.levels,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}.levels`, data.levels);

    return result.success;
  };

  const setLevelsItem = async (data: TLevelsItem, path: string) => {
    const result = await updateLevelsItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(path as `buildings.${number}.units.${number}.levels.${number}`, data);

    return result.success;
  };

  const setRooms = async (data: TRooms, path: string) => {
    const result = await updateRooms({
      reportId: report.id,
      path: path,
      payload: data.rooms,
    });

    if (!result.success) {
      return result.success;
    }
    form.setValue(path as `buildings.${number}.units.${number}.levels.${number}.rooms`, data.rooms);

    return result.success;
  };

  const setRoomsItem = async (data: TRoomsItem, path: string) => {
    const result = await updateRoomsItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}`,
      data,
    );

    return result.success;
  };

  const setPlumbingFixtures = (data: TPlumbingFixtures, path: string) => {
    /**
     * Don't add intermediate data save
     * because this is an optional field and depends on a condition at a higher data level
     * Must be saved together with the parent data level, otherwise there will be errors during data validation
     */
    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.plumbingFixtures`,
      data.plumbingFixtures,
    );
  };

  const setRoomFeatures = async (data: TRoomFeatures, path: string) => {
    const result = await updateRoomFeatures({
      reportId: report.id,
      path: path,
      payload: data.roomFeatures,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.roomFeatures`,
      data.roomFeatures,
    );

    return result.success;
  };

  const setInteriorDeficiencies = async (data: TInteriorDeficiencies, path: string) => {
    const result = await updateInteriorDeficiencies({
      reportId: report.id,
      path: path,
      payload: data.interiorDeficiencies,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.interiorDeficiencies`,
      data.interiorDeficiencies,
    );

    return result.success;
  };

  const setInteriorDeficienciesItem = async (data: TInteriorDeficienciesItem, path: string) => {
    const result = await updateInteriorDeficienciesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.interiorDeficiencies.${number}`,
      data,
    );

    return result.success;
  };

  const setInteriorUpdates = async (data: TInteriorUpdates, path: string) => {
    const result = await updateInteriorUpdates({
      reportId: report.id,
      path: path,
      payload: data.interiorUpdates,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.interiorUpdates`,
      data.interiorUpdates,
    );

    return result.success;
  };

  const setInteriorUpdatesItem = async (data: TInteriorUpdatesItem, path: string) => {
    const result = await updateInteriorUpdatesItem({
      reportId: report.id,
      path: path,
      payload: data,
    });

    if (!result.success) {
      return result.success;
    }

    form.setValue(
      path as `buildings.${number}.units.${number}.levels.${number}.rooms.${number}.interiorUpdates.${number}`,
      data,
    );

    return result.success;
  };

  const handleBackward = () => {
    const backPath = activeInnerPath.split('.').slice(0, -1).join('.');
    setActiveInnerPath(backPath);
  };
  const buildingData = buildingsState.buildings;
  return (
    <>
      <DrawerProvider>
        <div className="mx-auto flex max-w-7xl flex-col items-center px-3 sm:px-6 lg:px-10">
          <div className="mb-[60px] w-full">
            <SectionBreadcrumb />
          </div>
          {activeInnerSegment === BUILDINGS_INNER_SEGMENT.MAIN && (
            <div className="w-full max-w-[612px] flex-col items-center">
              <header className="mb-[60px] flex justify-between">
                <ReportSectionHeader
                  title={calcInnerSegmentTitle(activeInnerSegment)}
                  description={STEP_DESCRIPTION}
                  variant="buildings"
                />
              </header>
              <main className="flex flex-col">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-10"
                  >
                    <input
                      type="hidden"
                      {...form.register('buildings')}
                    />

                    {fieldsArray.fields.map((buildingItem, index) => {
                      const isEmpty = Object.keys(buildingItem).length === 1; // including id
                      const errorMessage = form.formState.errors?.buildings?.[index]
                        ? isEmpty
                          ? 'Required'
                          : 'Contains errors'
                        : '';

                      return (
                        <FormArrayControl
                          key={buildingItem.id}
                          title={`Building ${calcArrayItemTitle(buildingItem.structureType)}`}
                          errorMessage={errorMessage}
                          description="Edit information"
                          mode={isStoredByGSE ? 'edit' : 'edit-remove'}
                          onAdd={() => {
                            setActiveInnerPath(`buildings.${index}`);
                            setActiveInnerSegment(BUILDINGS_INNER_SEGMENT.BUILDING);
                          }}
                          onEdit={() => {
                            setActiveInnerPath(`buildings.${index}`);
                            setActiveInnerSegment(BUILDINGS_INNER_SEGMENT.BUILDING);
                          }}
                          onRemove={() => {
                            fieldsArray.remove(index);
                          }}
                        />
                      );
                    })}

                    {fieldsArray.fields.length === 0 && (
                      <FormArrayControl
                        title="Building"
                        errorMessage={form.formState.errors.buildings ? 'Required' : ''}
                        description="Add information"
                        mode="add"
                        onAdd={() => {
                          fieldsArray.append({} as TBuildingsObjSchema['buildings'][0]);
                          setActiveInnerPath('buildings.0');
                          setActiveInnerSegment(BUILDINGS_INNER_SEGMENT.BUILDING);
                        }}
                      />
                    )}

                    {!!fieldsArray.fields.length && (
                      <div className="flex w-full items-center justify-center pt-5">
                        <Button
                          variant="outline"
                          className="w-96"
                          disabled={isStoredByGSE}
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            const nextIndex = fieldsArray.fields.length;
                            fieldsArray.append({} as TBuildingsObjSchema['buildings'][0]);
                            setActiveInnerPath(`buildings.${nextIndex}`);
                            setActiveInnerSegment(BUILDINGS_INNER_SEGMENT.BUILDING);
                          }}
                        >
                          <Icon
                            icon="plus"
                            size="sm"
                            className="mr-2.5"
                          />
                          Add Building
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-end gap-1.5 pt-5">
                      <Button
                        variant="ghost"
                        disabled={form.formState.isSubmitting}
                        className="flex-1 basis-48"
                        asChild
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

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.BUILDING && (
            <BuildingsItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setBuildingsItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}
          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCIES && (
              <ExteriorDeficienciesForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={{
                  exteriorDeficiencies: activeSegmentState,
                }}
                onSave={setExteriorDeficiencies}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}
          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.EXTERIOR_DEFICIENCY && (
              <ExteriorDeficienciesItemForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={activeSegmentState}
                onSave={setExteriorDeficienciesItem}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.EXTERIOR_UPDATES && (
            <ExteriorUpdatesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                exteriorUpdates: activeSegmentState,
              }}
              onSave={setExteriorUpdates}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.EXTERIOR_UPDATE && (
            <ExteriorUpdatesItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setExteriorUpdatesItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.UNITS && (
            <UnitsForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                units: activeSegmentState,
              }}
              onSave={setUnits}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.UNIT && (
            <UnitsItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setUnitsItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.HEATING_SYSTEMS && (
            <HeatingSystemsForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                heatingSystems: activeSegmentState,
              }}
              onSave={setHeatingSystems}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.COOLING_SYSTEMS && (
            <CoolingSystemsForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                coolingSystems: activeSegmentState,
              }}
              onSave={setCoolingSystems}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.MECHANICAL_DEFICIENCIES && (
              <MechanicalDeficienciesForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={{
                  mechanicalDeficiencies: activeSegmentState,
                }}
                onSave={setMechanicalDeficiencies}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.MECHANICAL_DEFICIENCY && (
              <MechanicalDeficienciesItemForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={activeSegmentState}
                onSave={setMechanicalDeficienciesItem}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.MECHANICAL_UPDATES && (
            <MechanicalUpdatesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                mechanicalUpdates: activeSegmentState,
              }}
              onSave={setMechanicalUpdates}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.MECHANICAL_UPDATE && (
            <MechanicalUpdatesItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setMechanicalUpdatesItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.GARAGES && (
            <GaragesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                garages: activeSegmentState,
              }}
              onSave={setGarages}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.GARAGE && (
            <GaragesItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setGaragesItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCIES && (
              <GarageDeficienciesForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={{
                  garageDeficiencies: activeSegmentState,
                }}
                onSave={setGarageDeficiencies}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.GARAGE_DEFICIENCY && (
            <GarageDeficienciesItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setGarageDeficienciesItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.LEVELS && (
            <LevelsForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                levels: activeSegmentState,
              }}
              onSave={setLevels}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.LEVEL && (
            <LevelsItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setLevelsItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.ROOMS && (
            <RoomsForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                rooms: activeSegmentState,
              }}
              onSave={setRooms}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.ROOM && (
            <RoomsItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setRoomsItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.PLUMBING_FIXTURES && (
            <PlumbingFixturesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                plumbingFixtures: activeSegmentState,
              }}
              onSave={setPlumbingFixtures}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.ROOM_FEATURES && (
            <RoomFeaturesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                roomFeatures: activeSegmentState,
              }}
              onSave={setRoomFeatures}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCIES && (
              <InteriorDeficienciesForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={{
                  interiorDeficiencies: activeSegmentState,
                }}
                onSave={setInteriorDeficiencies}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath &&
            activeInnerSegment === BUILDINGS_INNER_SEGMENT.INTERIOR_DEFICIENCY && (
              <InteriorDeficienciesItemForm
                path={activeInnerPath}
                stepDescription={STEP_DESCRIPTION}
                data={activeSegmentState}
                onSave={setInteriorDeficienciesItem}
                onNextStep={setActiveInnerSegment}
                onNextPath={setActiveInnerPath}
                onBackward={handleBackward}
                isPartiallyFilled={isPartiallyFilled}
                isViewMode={isStoredByGSE}
              />
            )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.INTERIOR_UPDATES && (
            <InteriorUpdatesForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={{
                interiorUpdates: activeSegmentState,
              }}
              onSave={setInteriorUpdates}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}

          {activeInnerPath && activeInnerSegment === BUILDINGS_INNER_SEGMENT.INTERIOR_UPDATE && (
            <InteriorUpdatesItemForm
              path={activeInnerPath}
              stepDescription={STEP_DESCRIPTION}
              data={activeSegmentState}
              onSave={setInteriorUpdatesItem}
              onNextStep={setActiveInnerSegment}
              onNextPath={setActiveInnerPath}
              onBackward={handleBackward}
              isPartiallyFilled={isPartiallyFilled}
              isViewMode={isStoredByGSE}
            />
          )}
        </div>
        <NavigationDrawer
          setActiveInnerSegment={setActiveInnerSegment}
          navigation={BUILDINGS_INNER_SEGMENT}
          activeInnerSegment={activeInnerSegment}
          activeInnerPath={activeInnerPath}
          buildings={buildingsState.buildings}
          onSelect={(path: string, navigationPath: string) => {
            setIsFromDrawer(true);
            setActiveInnerPath(path);
            setActiveInnerSegment(BUILDINGS_INNER_SEGMENT.MAIN);
            setTempPath(navigationPath);
          }}
        />
        {!isStoredByGSE && <PreventNavigation isDirty />}
      </DrawerProvider>
    </>
  );
};

export default BuildingsForm;
