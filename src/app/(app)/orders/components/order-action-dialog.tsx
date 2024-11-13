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
  action: 'abandon' | 'remove';
  handleAbandonOrder: (id: string) => void;
  handleRemoveOrder: (id: string) => void;
  selectedOrder: Orders | null;
}

const OrderActionDialog: React.FC<IProps> = ({
  open,
  handleClose,
  action,
  handleAbandonOrder,
  selectedOrder,
  handleRemoveOrder,
}) => {
  const abandonOrder = async () => {
    if (!selectedOrder?.id) return;
    await handleAbandonOrder(selectedOrder.id);
    handleClose();
  };

  const removeOrder = async () => {
    if (!selectedOrder?.id) return;
    await handleRemoveOrder(selectedOrder.id);
    handleClose();
  };
  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogContent
          className={`flex ${action === 'abandon' ? ' w-[398px]' : ' w-[351px]'} ${action === 'abandon' ? 'h-[290px]' : 'h-[250px]'} flex-col items-center gap-4 rounded-lg bg-white p-6`}
        >
          <DialogHeader className="flex flex-col items-center">
            {action === 'abandon' ? (
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-200">
                <Icon
                  size={'sm'}
                  icon={'trash'}
                  className=" bg-red-200 text-red-800"
                />
              </div>
            ) : (
              <div className="rounded-lg bg-sky-50 p-5">
                <Icon
                  size={'sm'}
                  icon={'trash'}
                  className=" bg-sky-50 text-red-800"
                />
              </div>
            )}

            <DialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              {action === 'abandon'
                ? 'Are you sure you want to cancel the order?'
                : 'Remove this order?'}
            </DialogTitle>
            <DialogDescription className="max-w-[304px] text-center text-sm font-normal text-slate-900">
              {action === 'abandon'
                ? 'Here is additional text warning of the consequences of cancelation.'
                : 'You will no longer be able to view this order.'}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4 flex w-full">
            {action === 'abandon' ? (
              <>
                <Button
                  type="button"
                  className="w-44 rounded-md border text-base font-bold text-sky-500"
                  onClick={() => handleClose()}
                  variant={'outline'}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="w-44 rounded-md text-base font-bold text-slate-50"
                  onClick={abandonOrder}
                >
                  Abandon Order
                </Button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="w-full rounded-md bg-sky-500 px-2 py-2 font-semibold text-white hover:bg-sky-600"
                  onClick={removeOrder}
                >
                  Remove Order
                </button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderActionDialog;
