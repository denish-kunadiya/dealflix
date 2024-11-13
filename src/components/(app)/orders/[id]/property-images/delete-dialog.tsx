import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => Promise<void>;
}

const DeleteDialog: React.FC<IProps> = ({ open, handleClose, handleDelete }) => {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <AlertDialog
        open={open}
        onOpenChange={handleClose}
      >
        <AlertDialogContent
          className={`flex h-[290px] w-[398px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6`}
        >
          <AlertDialogHeader className="flex flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-red-200">
              <Icon
                icon={'trash'}
                className=" text-red-500"
              />
            </div>

            <AlertDialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              Are you sure you want to Delete the image?
            </AlertDialogTitle>
            <AlertDialogDescription className="max-w-[304px] text-center text-sm font-normal text-slate-900">
              Here is additional text warning of the consequences of cancelation.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex">
            <>
              <Button
                type="button"
                className="w-[174px] rounded-lg border"
                variant={'outline'}
                size={'sm'}
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size={'sm'}
                className="w-[174px] rounded-lg bg-red-500 hover:bg-red-400"
                variant={'default'}
                onClick={async () => {
                  setLoading(true);
                  await handleDelete();
                  setLoading(false);
                }}
                disabled={loading}
              >
                Delete Image
              </Button>
            </>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteDialog;
