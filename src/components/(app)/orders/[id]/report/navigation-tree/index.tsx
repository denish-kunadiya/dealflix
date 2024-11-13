import { useDrawer } from '@/utils/hooks/use-navigation-drawer-context';
import React from 'react';

type Path = string;
type Segment = string;
type Index = number;
type NavigationPaths = {
  [key: string]: string;
};

interface TreeNode {
  [key: string]: TreeNode | { __path: Path };
}

const createTree = (navObject: Record<string, Path>): TreeNode => {
  const tree: TreeNode = {};

  Object.values(navObject).forEach((path: Path) => {
    const segments: Segment[] = path.split('/');
    let current: TreeNode = tree;

    segments.forEach((segment: Segment, index: Index) => {
      if (!current[segment]) {
        current[segment] = { __path: segments.slice(0, index + 1).join('/') };
      }
      current = current[segment] as TreeNode;
    });
  });

  return tree;
};

const renderTree = (
  tree: TreeNode,
  setActiveInnerSegment: (path: Path) => void,
  activeInnerSegment: string,
  closeDrawer: () => void,
): JSX.Element => {
  return (
    <ul className="ml-8 mt-2 list-none">
      {Object.keys(tree).map((key) =>
        key !== '__path' ? (
          <li key={key}>
            <div
              onClick={() => {
                setActiveInnerSegment((tree[key] as { __path: Path }).__path);
                closeDrawer();
              }}
              className={`m-2 flex cursor-pointer items-center gap-2 px-3 py-1 text-[13px] font-normal  ${activeInnerSegment === tree[key].__path ? 'bg-sky-50 text-sky-500' : ''}`}
            >
              {key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (str) => str.toUpperCase())}
              {activeInnerSegment === tree[key].__path && (
                <div className="h-2 w-2 rounded-sm bg-sky-500"></div>
              )}
            </div>
            {renderTree(
              tree[key] as TreeNode,
              setActiveInnerSegment,
              activeInnerSegment,
              closeDrawer,
            )}
          </li>
        ) : null,
      )}
    </ul>
  );
};

const NavigationTree = ({
  setActiveInnerSegment,
  navigation,
  activeInnerSegment,
}: {
  setActiveInnerSegment: (path: Path) => void;
  navigation: NavigationPaths;
  activeInnerSegment: string;
}) => {
  const { closeDrawer } = useDrawer();
  const tree = createTree(navigation);

  return <>{renderTree(tree, setActiveInnerSegment, activeInnerSegment, closeDrawer)}</>;
};

export default NavigationTree;
