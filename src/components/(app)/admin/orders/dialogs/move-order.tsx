import React from 'react';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleInitiateAvailableOrder: (
    assignee: string,
    type: 'available' | 'initiated',
  ) => Promise<void>;
  order: Orders;
  moveTo: 'available' | 'initiated';
}

const MoveOrderDialog: React.FC<IProps> = ({
  open,
  handleClose,
  handleInitiateAvailableOrder,
  order,
  moveTo,
}) => {
  const changeStatus = async () => {
    await handleInitiateAvailableOrder(order.id, moveTo);
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogContent
          className={`flex h-[308px] w-[398px] flex-col items-center gap-4 rounded-lg bg-white p-6`}
        >
          <DialogHeader className="flex flex-col items-center">
            <div className="rounded-lg bg-[#FEF3C7] p-5">
              <Icon
                icon={'flag'}
                className=" text-amber-400"
              />
            </div>

            <DialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              Are you sure you want to move the order to{' '}
              {moveTo === 'initiated' ? 'Initiated' : 'Available'}?
            </DialogTitle>
            <DialogDescription className="max-w-[304px] text-center text-sm font-normal text-slate-900">
              Order will disappear from the photographer who works with it and the report will have
              to be created again.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex w-[358px]">
            <>
              <Button
                type="button"
                className="w-[174px] rounded-lg border"
                size={'sm'}
                onClick={() => handleClose()}
                variant={'outline'}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size={'sm'}
                className="w-[174px] rounded-lg text-slate-50"
                variant={'default'}
                onClick={changeStatus}
              >
                Move to {moveTo === 'initiated' ? 'Initiated' : 'Available'}{' '}
              </Button>
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MoveOrderDialog;
