import { Icon } from '@/components/ui/icon';
import React from 'react';

export interface IPathHeadingProps {
  title: string;
  noOfImageUpload: number;
  imageUploadUrl?: string;
}

const PathHeading = ({ title, noOfImageUpload, imageUploadUrl }: IPathHeadingProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200">
        {!!imageUploadUrl ? (
          <img
            className="h-full w-full rounded-xl object-cover"
            src={imageUploadUrl}
            alt=""
          />
        ) : (
          <Icon
            icon="chevron-image"
            className="text-slate-400"
          />
        )}
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="text-sm font-normal text-slate-400">{noOfImageUpload} img uploaded </p>
      </div>
    </div>
  );
};

export default PathHeading;
