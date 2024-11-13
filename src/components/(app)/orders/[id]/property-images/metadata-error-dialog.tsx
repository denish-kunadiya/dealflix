import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface IProps {
  open: boolean;
  handleClose: () => void;
}

const MetadataErrorDialog: React.FC<IProps> = ({ open, handleClose }) => {
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
            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#FEF3C7]">
              <Icon
                icon={'information'}
                className=" text-amber-400"
              />
            </div>

            <AlertDialogTitle className="mt-4 max-w-[304px] text-center text-lg font-bold text-slate-900">
              Location information is missing on the image file.
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex">
            <>
              <Button
                type="button"
                size={'sm'}
                className="w-[174px]"
                variant={'default'}
                onClick={handleClose}
              >
                Ok
              </Button>
            </>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MetadataErrorDialog;
