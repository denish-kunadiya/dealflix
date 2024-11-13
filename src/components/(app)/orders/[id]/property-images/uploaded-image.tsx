import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { StatusBadge } from '@/components/ui/status-badge';
import React, { useState } from 'react';
import DeleteDialog from './delete-dialog';

const UploadedImage = ({
  image,
  handleReportImageDelete,
  isDeleteVisible,
}: {
  image: Photo;
  handleReportImageDelete: (image: Photo) => Promise<void>;
  isDeleteVisible: boolean;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <img
        src={image.url as string}
        height={248}
        width={363}
        alt="Preview"
        className="h-[248px] w-[363px] rounded-lg"
      />
      <div className="absolute inset-0 rounded-lg bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-sm text-emerald-400">
        {!image.error && (
          <>
            <span>
              {image.fnm_status === 'meta_verified'
                ? 'Metadata Varified'
                : image.fnm_status === 'fnm_accepted'
                  ? 'Accepted'
                  : ''}
            </span>
            <Icon
              size="sm"
              icon="double-check"
            />
          </>
        )}
        {image.error && <StatusBadge variant={'gseRejected'}>{image.error}</StatusBadge>}
      </div>
      {isDeleteVisible && (
        <Button
          onClick={() => setOpen(true)}
          className="absolute right-0 top-0 bg-transparent hover:bg-transparent"
        >
          <Icon
            size="sm"
            icon="trash"
            variant={'destructive'}
          />
        </Button>
      )}
      {open && (
        <DeleteDialog
          open={open}
          handleClose={() => setOpen(false)}
          handleDelete={async () => await handleReportImageDelete(image)}
        />
      )}
    </div>
  );
};

export default UploadedImage;
