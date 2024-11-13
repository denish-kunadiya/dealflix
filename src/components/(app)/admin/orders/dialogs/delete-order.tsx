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
  deleteOrder: (orderId: string) => Promise<void>;
  order: Orders;
}

const DeleteOrderDialog: React.FC<IProps> = ({ open, handleClose, deleteOrder, order }) => {
  const deleteCurrentOrder = async () => {
    await deleteOrder(order.id);
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogContent
          className={`flex h-[290px] w-[398px] flex-col items-center gap-4 rounded-lg bg-white p-6`}
        >
          <DialogHeader className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-200">
              <Icon
                icon={'trash'}
                className=" text-red-500"
              />
            </div>

            <DialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              Are you sure you want to Delete the order?
            </DialogTitle>
            <DialogDescription className="max-w-[304px] text-center text-sm font-normal text-slate-900">
              Here is additional text warning of the consequences of cancelation.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex">
            <>
              <Button
                type="button"
                className="w-[174px] rounded-lg border"
                variant={'outline'}
                size={'sm'}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size={'sm'}
                className="w-[174px] rounded-lg bg-red-500 hover:bg-red-400"
                variant={'default'}
                onClick={deleteCurrentOrder}
              >
                Delete Order
              </Button>
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeleteOrderDialog;
