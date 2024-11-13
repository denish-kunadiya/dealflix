'use client';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { useDrawer } from '@/utils/hooks/use-navigation-drawer-context';
import React from 'react';
import NavigationTree from './navigation-tree';
import { usePathname } from 'next/navigation';
import { calcArrayItemTitle } from '@/utils/reports/helpers';
import {
  TBuildingsItemSchema,
  TExteriorDeficiencies,
  TExteriorUpdates,
  TLevels,
  TLevelsItem,
  TRoomsItem,
  TUnitsItem,
} from '@/utils/api/schemas/report';

type NavigationPaths = {
  [key: string]: string;
};

type Path = {
  indexedPath: string;
  stringPath: string;
};
type RelativePath = {
  relativePath?: string;
};

type TBuildingsItemWithPath = {
  path: { stringPath: string; indexedPath: string };
  relativePath: string;
  units: TUnitsItemWithPath[];
  buildingName: string; // Add this line to include buildingName
  unitNumber: number;
  exteriorUpdates: TExteriorUpdates[];
  exteriorDeficiencies: TExteriorDeficiencies[];
  structureType: string;
  structureArea: number;
  yearBuiltEstimate: boolean;
  attachmentType: string;
  foundationType: string;
  constructionStatus: string;
  constructionType: string;
  containsRooms: string;
  yearBuilt: number;
};

type TUnitsItemWithPath = {
  path: { stringPath: string; indexedPath: string };
  relativePath: string;
  levels: TLevelsWithPath[];
  unitNumber?: number;
};

type TRoomsWithPath = TRoomsItem & { path: Path } & RelativePath;
type TLevelsWithPath = TLevels & { path: Path } & RelativePath & { levelNumber: number } & {
    rooms: TRoomsWithPath[];
  };

const NavigationDrawer = ({
  setActiveInnerSegment,
  activeInnerSegment,
  navigation,
  buildings,
  onSelect,
  activeInnerPath,
}: {
  setActiveInnerSegment: (path: string) => void;
  activeInnerSegment: string;
  navigation: NavigationPaths;
  buildings?: TBuildingsItemSchema[];
  onSelect?: (path1: string, path2: string) => void;
  activeInnerPath?: string;
}) => {
  const { isOpen, closeDrawer } = useDrawer();

  function convertToTitleCase(text: string) {
    if (text && text.trim()) {
      let result = text?.toLowerCase()?.replace(/_/g, ' ');
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
  }

  function generateTreeWithPathsAndRelativePaths(
    data: TBuildingsItemSchema[],
    basePath = 'buildings',
    indexPath = 'buildings',
  ) {
    return data?.map((building: TBuildingsItemSchema, buildingIndex: number) => {
      if (!building.units) return;
      const buildingPath = `${basePath}/${buildingIndex}`;
      const buildingIndexPath = `${indexPath}.${buildingIndex}`;
      const relativePath = navigation['BUILDING'];

      const units = building?.units?.map((unit: TUnitsItem, unitIndex: number) => {
        const unitPath = `${buildingPath}/units/${unitIndex}`;
        const unitIndexPath = `${buildingIndexPath}.units.${unitIndex}`;
        const relativePath = navigation['UNIT'];

        const levels = unit?.levels?.map((level: TLevelsItem, levelIndex: number) => {
          const levelPath = `${unitPath}/levels/${levelIndex}`;
          const levelIndexPath = `${unitIndexPath}.levels.${levelIndex}`;
          const relativePath = navigation['LEVEL'];

          const rooms = level?.rooms?.map((room: TRoomsItem, roomIndex: number) => {
            const roomPath = `${levelPath}/rooms/${roomIndex}`;
            const roomIndexPath = `${levelIndexPath}.rooms.${roomIndex}`;
            const relativePath = navigation['ROOM'];

            return {
              ...room,
              path: {
                stringPath: roomPath,
                indexedPath: roomIndexPath,
              },
              relativePath: relativePath,
            };
          });

          return {
            ...level,
            path: {
              stringPath: levelPath,
              indexedPath: levelIndexPath,
            },
            relativePath: relativePath,
            rooms: rooms,
          };
        });

        return {
          ...unit,
          path: {
            stringPath: unitPath,
            indexedPath: unitIndexPath,
          },
          relativePath: relativePath,
          levels: levels,
        };
      });

      return {
        ...building,
        path: {
          stringPath: buildingPath,
          indexedPath: buildingIndexPath,
        },
        relativePath: relativePath,
        units: units,
      };
    });
  }

  const TreeNode = ({ data, idx }: { data: TBuildingsItemWithPath; idx: number }) => {
    const renderRoomDetails = (room: TRoomsWithPath) => {
      return (
        <ul className="ps-4">
          {room.roomFeatures && (
            <li>
              <div
                className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `${room.path.indexedPath}.roomFeatures` ? 'bg-sky-50 text-sky-500' : ''}`}
                onClick={() => {
                  handleNodeClick(`${room.path.indexedPath}.roomFeatures`, {
                    ...room,
                    relativePath: `${room.relativePath}/roomFeatures`,
                  });
                }}
              >
                Room Features
                {activeInnerPath === `${room.path.indexedPath}.roomFeatures` && (
                  <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                )}
              </div>
            </li>
          )}
          {room.plumbingFixtures && (
            <li className="">
              <div
                className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `${room.path.indexedPath}.plumbingFixtures` ? 'bg-sky-50 text-sky-500' : ''}`}
                onClick={() => {
                  handleNodeClick(`${room.path.indexedPath}.plumbingFixtures`, {
                    ...room,
                    relativePath: `${room.relativePath}/plumbingFixtures`,
                  });
                }}
              >
                Plumbing Features
                {activeInnerPath === `${room.path.indexedPath}.plumbingFixtures` && (
                  <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                )}
              </div>
            </li>
          )}
          {room.interiorUpdates && (
            <li className="">
              <div
                className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `${room.path.indexedPath}.interiorUpdates` ? 'bg-sky-50 text-sky-500' : ''}`}
                onClick={() => {
                  handleNodeClick(`${room.path.indexedPath}.interiorUpdates`, {
                    ...room,
                    relativePath: `${room.relativePath}/interiorUpdates`,
                  });
                }}
              >
                Interior Updates
                {activeInnerPath === `${room.path.indexedPath}.interiorUpdates` && (
                  <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                )}
              </div>
            </li>
          )}
          {room.interiorDeficiencies && (
            <li className="">
              <div
                className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `${room.path.indexedPath}.interiorDeficiencies` ? 'bg-sky-50 text-sky-500' : ''}`}
                onClick={() => {
                  handleNodeClick(`${room.path.indexedPath}.interiorDeficiencies`, {
                    ...room,
                    relativePath: `${room.relativePath}/interiorDeficiencies`,
                  });
                }}
              >
                Interior Deficiencies
                {activeInnerPath === `${room.path.indexedPath}.interiorDeficiencies` && (
                  <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                )}
              </div>
            </li>
          )}
        </ul>
      );
    };

    const renderRooms = (rooms: TRoomsWithPath[]) => {
      return rooms?.map((room: TRoomsWithPath, index: number) => (
        <li
          key={index}
          className="ps-4"
        >
          <div
            className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === room.path.indexedPath ? 'bg-sky-50 text-sky-500' : ''}`}
            onClick={() => handleNodeClick(room?.path.indexedPath, room)}
          >
            <div>{convertToTitleCase(room?.roomType)}</div>
            {activeInnerPath === room.path.indexedPath && (
              <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
            )}
          </div>
          {renderRoomDetails(room)}
        </li>
      ));
    };

    const renderLevels = (levels: TLevelsWithPath[]) => {
      return levels?.map((level: TLevelsWithPath, index: number) => (
        <li
          key={index}
          className="ps-4"
        >
          <div
            onClick={() => handleNodeClick(level.path.indexedPath, level)}
            className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === level.path.indexedPath ? 'bg-sky-50 text-sky-500' : ''}`}
          >
            <div>Floor {level.levelNumber}</div>
            {activeInnerPath === level.path.indexedPath && (
              <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
            )}
          </div>
          {level?.rooms?.length > 0 && <ul>{renderRooms(level.rooms)}</ul>}
        </li>
      ));
    };

    const renderUnits = (units: TUnitsItemWithPath[] | undefined) => {
      return units?.map((unit: TUnitsItemWithPath, index: number) => (
        <li
          key={index}
          className="ps-4"
        >
          <div
            onClick={() => handleNodeClick(unit.path.indexedPath, unit)}
            className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === unit.path.indexedPath ? 'bg-sky-50 text-sky-500' : ''}`}
          >
            <div>Unit {index + 1}</div>
            {activeInnerPath === unit.path.indexedPath && (
              <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
            )}
          </div>
          {unit?.levels?.length > 0 && <ul>{renderLevels(unit?.levels)}</ul>}
        </li>
      ));
    };

    return (
      <ul>
        <li>
          <span
            className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === data?.path?.indexedPath ? 'bg-sky-50 text-sky-500' : ''}`}
            onClick={() => handleNodeClick(data?.path.indexedPath, data)}
          >
            Building {idx + 1} {calcArrayItemTitle(data?.structureType)}
            {activeInnerPath === data?.path?.indexedPath && (
              <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
            )}
          </span>
          {data?.units?.length > 0 && (
            <ul>
              {renderUnits(data?.units)}
              <li className="flex items-center">
                <div
                  className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `buildings.${idx}.exteriorUpdates` ? 'bg-sky-50 text-sky-500' : ''}`}
                  onClick={() =>
                    handleNodeClick(`buildings.${idx}.exteriorUpdates`, {
                      ...data,
                      relativePath: 'buildings/building/exteriorUpdates',
                    })
                  }
                >
                  {data?.exteriorUpdates ? 'Exterior Updates' : ''}
                  {activeInnerPath === `buildings.${idx}.exteriorUpdates` && (
                    <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                  )}
                </div>
              </li>
              <li className="flex items-center">
                <div
                  className={` flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal ${activeInnerPath === `buildings.${idx}.exteriorDeficiencies` ? 'bg-sky-50 text-sky-500' : ''}`}
                  onClick={() =>
                    handleNodeClick(
                      `buildings.${idx}.exteriorDeficiencies`,

                      { ...data, relativePath: 'buildings/building/exteriorDeficiencies' },
                    )
                  }
                >
                  {data?.exteriorDeficiencies ? 'Exterior Deficiencies' : ''}
                  {activeInnerPath === `buildings.${idx}.exteriorDeficiencies` && (
                    <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
                  )}
                </div>
              </li>
            </ul>
          )}
        </li>
      </ul>
    );
  };
  const pathName = usePathname();

  const handleNodeClick = async (path: string, navigationPath: any) => {
    onSelect && onSelect(path, navigationPath.relativePath);
    closeDrawer();
  };

  return (
    <>
      <div>
        {isOpen && (
          <div
            className="fixed inset-0 z-30 bg-[#E0E4E7] opacity-50"
            onClick={closeDrawer}
          ></div>
        )}
      </div>
      <div
        id="drawer-navigation"
        className={`fixed right-0 top-0 z-40 h-screen w-[602px] overflow-y-auto bg-white transition-transform dark:bg-slate-800 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        tabIndex={-1}
      >
        <div className="flex items-center justify-between border-b p-5">
          <p
            id="drawer-navigation-label"
            className="pb-[9px] text-[22px] font-bold text-slate-900 dark:text-slate-400"
          >
            Navigation
          </p>
          <Button
            type="button"
            size={'sm'}
            className="h-8 rounded-lg bg-sky-100"
            onClick={closeDrawer}
            variant={'ghost'}
          >
            <Icon
              icon="x"
              size="sm"
              className=" text-sky-500"
            />
          </Button>
        </div>
        <div className="flex flex-col gap-[38.5px] px-5 py-[38px]">
          {pathName.includes('site') ? (
            <NavigationTree
              setActiveInnerSegment={setActiveInnerSegment}
              navigation={navigation}
              activeInnerSegment={activeInnerSegment}
            />
          ) : (
            buildings &&
            buildings?.length > 0 &&
            generateTreeWithPathsAndRelativePaths(buildings)?.map(
              (building: any, index: number) => (
                <TreeNode
                  key={index}
                  idx={index}
                  data={building}
                />
              ),
            )
          )}
        </div>
      </div>
    </>
  );
};

export default NavigationDrawer;
