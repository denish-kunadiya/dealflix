'use client';
import { Icon } from '@/components/ui/icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React from 'react';

interface IBottomInfoCardProps {
  name: string;
  description: string;
  note?: string;
}

const BottomInfoCard = ({ name, description, note }: IBottomInfoCardProps) => {
  return (
    <div className="h-[68px] w-[363px]">
      <div className="mb-2 mt-5 flex items-center text-sm font-semibold ">
        <span>{name}</span>
        {note && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="mx-1.5 h-[18px] w-[18px]">
                  <Icon
                    icon="chevron-info"
                    size={'sm'}
                    className="mt-1 h-[14px] w-[14px] text-sky-500"
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                align="start"
              >
                {note}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <span className="w-[313px] text-sm font-normal text-slate-400">{description}</span>
    </div>
  );
};

export default BottomInfoCard;
