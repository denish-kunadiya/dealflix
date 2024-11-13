import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

interface IProps {
  title: string;
  description: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  cancelText?: string;
  confirmText?: string;
  varinant?: 'warning' | 'danger';
  mode?: 'confirm' | 'cancel-confirm';
}

export function AlertModal({
  title,
  description,
  open,
  onConfirm,
  onCancel,
  cancelText = 'Cancel',
  confirmText = 'Continue',
  varinant = 'danger',
  mode = 'cancel-confirm',
}: IProps) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="mb-2.5 flex w-full items-center justify-center">
            <div
              className={cn(
                varinant === 'danger' ? 'bg-red-100' : 'bg-amber-100',
                'flex h-16 w-16 items-center justify-center rounded-xl',
              )}
            >
              <TriangleAlert
                className={cn(varinant === 'danger' ? 'text-red-500' : 'text-amber-500', 'h-6 w-6')}
              />
            </div>
          </div>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {mode === 'cancel-confirm' && (
            <Button
              size="sm"
              variant="outline"
              className="sm:flex-1"
              onClick={onCancel}
            >
              {cancelText}
            </Button>
          )}
          <Button
            size="sm"
            className="sm:flex-1"
            variant={varinant === 'danger' ? 'destructive' : 'default'}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
