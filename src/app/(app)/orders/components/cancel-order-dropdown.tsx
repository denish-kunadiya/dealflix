import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface IProps {
  handleAction: (item: Orders, type: 'abandon' | 'remove') => void;
  item: Orders;
  type: 'abandon' | 'remove';
}

const CancelOrderDropdown: React.FC<IProps> = ({ handleAction, item, type }) => {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu
      open={open}
      onOpenChange={setOpen}
    >
      <DropdownMenuTrigger
        className="border-0 focus-visible:outline-none"
        onClick={() => setOpen(!open)}
      >
        <EllipsisVertical className=" h-[29px] w-[29px] text-slate-400" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mt-2 flex h-[38px] min-w-[203px] items-center">
        {type === 'abandon' ? (
          <Button
            className={`group  flex w-full items-baseline justify-start rounded-md text-[13px] font-medium text-slate-700 hover:bg-slate-100`}
            onClick={() => {
              setOpen(false);
              handleAction(item, 'abandon');
            }}
            variant={'ghost'}
          >
            <div className="me-2.5 h-[18px] w-[18px]">
              <Icon icon={'trash'} />
            </div>
            <span className="text-[13px] font-medium text-slate-700">Abandon Order</span>
          </Button>
        ) : (
          <Button
            className={`group  flex w-full items-baseline justify-start rounded-md  text-[13px] font-medium text-slate-700`}
            onClick={() => {
              setOpen(false);
              handleAction(item, 'remove');
            }}
            variant={'ghost'}
          >
            <div className="me-2.5 h-[18px] w-[18px]">
              <Icon icon={'trash'} />
            </div>
            <span className="text-[13px] font-medium text-slate-700">Remove</span>
          </Button>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CancelOrderDropdown;
