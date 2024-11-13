import React, { useCallback, useEffect, useState } from 'react';
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CustomSelect from '../select-photographer';
import { Icon } from '@/components/ui/icon';
import { getPhotographers } from '@/app/admin/orders/action';
import { notify } from '@/components/ui/toastify/toast';

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleAssignOrder: (orderId: string, data: AssignedUser) => Promise<void>;
  order?: Orders;
}

const AssignDialog: React.FC<IProps> = ({ open, handleClose, order, handleAssignOrder }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [photographers, setPhotographers] = useState<any>([]);
  const [selectedUser, setSelectedUser] = useState<AssignedUser | undefined>();
  const fetchPhotographers = useCallback(async () => {
    setLoading(true);
    const data = await getPhotographers();
    console.log('data', data);
    if (data.success) {
      setPhotographers(data.data);
    } else if (data.error) {
      setPhotographers([]);
      notify({
        title: 'Error',
        text: 'Something went wrong.',
        type: 'error',
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPhotographers();
  }, [fetchPhotographers]);

  useEffect(() => {
    if (order?.assignee?.user_id && order?.assignee_id !== null) {
      setSelectedUser({
        photographer: {
          ...order.assignee,
        },
        role: 'photographer',
        id: order.assignee.user_id,
        user_id: order.assignee.user_id,
      });
    }
  }, [order?.assignee, order?.assignee_id]);

  return (
    <div>
      <Dialog
        open={open}
        onOpenChange={handleClose}
      >
        <DialogContent
          className={`flex h-[352px] w-[398px] flex-col items-center gap-4 rounded-lg bg-white p-6`}
        >
          <DialogHeader className="flex flex-col items-center">
            <div className="rounded-lg bg-sky-50 p-5">
              <Icon
                icon={'user'}
                className=" text-sky-500"
              />
            </div>

            <DialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              Select the user to whom you want to assign the order
            </DialogTitle>
            <DialogDescription className="max-w-[304px] text-center text-sm font-normal text-slate-900">
              Here is additional text warning of the consequences of cancelation.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <CustomSelect
              photographers={photographers}
              loading={loading}
              onSelectUser={(v: any) => {
                if (v) {
                  setSelectedUser(v);
                } else {
                  setSelectedUser(undefined);
                }
              }}
              selectedUserId={selectedUser?.user_id}
            />
          </div>

          <DialogFooter className="mt-4 flex w-full">
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
                className="w-[174px] rounded-lg"
                size={'sm'}
                onClick={async () => {
                  if (order?.id && selectedUser?.id) {
                    await handleAssignOrder(order?.id, selectedUser);
                    handleClose();
                  }
                }}
              >
                Assign Order
              </Button>
            </>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignDialog;
