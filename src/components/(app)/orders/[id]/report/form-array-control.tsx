import React from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';

interface IFormArrayControlProps {
  title: string;
  description?: string;
  errorMessage?: string;
  mode?: 'add' | 'edit' | 'edit-remove';
  onEdit?: () => void;
  onRemove?: () => void;
  onAdd?: () => void;
}

const FormArrayControl = ({
  title,
  description,
  errorMessage,
  mode = 'add',
  onEdit = () => null,
  onRemove = () => null,
  onAdd = () => null,
}: IFormArrayControlProps) => {
  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onAdd();
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onEdit();
  };

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onRemove();
  };

  return (
    <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-200 py-5 sm:flex-row sm:items-center sm:space-x-2">
      <div className="flex h-full flex-col">
        <p className="text-lg font-bold text-slate-900">{title}</p>
        {errorMessage ? (
          <p className="text-base font-normal text-red-500">{errorMessage}</p>
        ) : (
          description && <p className="text-base font-normal text-slate-400">{description}</p>
        )}
      </div>
      <div className="flex w-full flex-grow flex-wrap justify-between gap-2 sm:w-auto sm:flex-nowrap sm:justify-end sm:gap-5 sm:py-1.5">
        {mode === 'edit-remove' && (
          <Button
            size="sm"
            variant="alert"
            className="min-w-[8.5rem] flex-1 sm:flex-initial"
            onClick={handleRemove}
          >
            <Icon
              icon="trash"
              size="sm"
              className="mr-2.5"
            />
            Delete
          </Button>
        )}
        {(mode === 'edit' || mode === 'edit-remove') && (
          <Button
            size="sm"
            variant="outline"
            className="min-w-[8.5rem] flex-1 sm:flex-initial"
            onClick={handleEdit}
          >
            <Icon
              icon="pencil"
              size="sm"
              className="mr-2.5"
            />
            Edit
          </Button>
        )}
        {mode === 'add' && (
          <Button
            size="sm"
            className="min-w-[8.5rem] flex-1 sm:flex-initial"
            onClick={handleAdd}
          >
            <Icon
              icon="plus"
              size="sm"
              className="mr-2.5"
            />
            Add
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormArrayControl;
