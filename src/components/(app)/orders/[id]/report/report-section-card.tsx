'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Eye } from 'lucide-react';

import { BadgeWithIconProps } from '@/components/ui/badge-with-icon';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

import ReportSctionHeader from './report-section-header';

export interface IReportSectionCardProps {
  title: string;
  description: string;
  variant?: BadgeWithIconProps['variant'];
  disabled?: boolean;
  nextSegment?: string;
  isFilledOut?: boolean;
  isValid?: boolean;
  isStoredByGSE?: boolean;
}

const ReportSectionCard = ({
  title,
  description,
  variant,
  disabled,
  nextSegment,
  isFilledOut,
  isValid,
  isStoredByGSE,
}: IReportSectionCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const buttonCaption = isStoredByGSE ? 'View' : isFilledOut ? 'Edit' : `Add ${title}`;

  const errorMsg = isFilledOut && !isValid ? 'Contains errors' : '';

  return (
    <div className="flex min-w-64 flex-1 flex-col space-y-2">
      <div className="space-y-2">
        <ReportSctionHeader
          variant={variant}
          title={title}
          description={description}
        />
        <p className="line-clamp-1 min-h-6 text-base font-normal text-red-500">{errorMsg}</p>
      </div>
      <Button
        variant="outline"
        className="w-full space-x-2.5"
        disabled={disabled}
        onClick={() => {
          router.push(`${pathname}/${nextSegment}`);
        }}
      >
        {isStoredByGSE ? (
          <Eye size={18} />
        ) : (
          <Icon
            icon={isFilledOut ? 'pencil' : 'plus'}
            size="sm"
          />
        )}
        <span>{buttonCaption}</span>
      </Button>
    </div>
  );
};
export default ReportSectionCard;
