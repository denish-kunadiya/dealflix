import { BadgeWithIcon, BadgeWithIconProps } from '@/components/ui/badge-with-icon';
import { Icon } from '@/components/ui/icon';
import { DrawerProvider, useDrawer } from '@/utils/hooks/use-navigation-drawer-context';

export interface IReportSectionHeaderProps {
  title: string;
  description: string;
  variant?: BadgeWithIconProps['variant'];
}

const ReportSectionHeader = ({ variant, title, description }: IReportSectionHeaderProps) => {
  const { openDrawer } = useDrawer();
  return (
    <DrawerProvider>
      <div className="flex w-full justify-between">
        <div className="flex items-end justify-between">
          <div className="flex space-x-5">
            <BadgeWithIcon variant={variant} />
            <div>
              <p className="text-base font-normal text-slate-400">{description}</p>
              <p className="text-lg font-semibold capitalize text-slate-900">{title}</p>
            </div>
          </div>
        </div>
        {(title.includes('>') || title === 'site' || title === 'buildings') && (
          <div
            className="flex cursor-pointer items-center gap-2.5 text-sky-500"
            onClick={openDrawer}
          >
            <span className="font-normal">Show navigation</span>
            <Icon
              icon={'stack'}
              size={'xs'}
            />
          </div>
        )}
      </div>
    </DrawerProvider>
  );
};

export default ReportSectionHeader;
