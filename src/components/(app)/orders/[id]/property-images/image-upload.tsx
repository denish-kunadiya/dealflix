import React, { useState } from 'react';
import { Icon } from '@/components/ui/icon';
import BottomInfoCard from './bottom-info-card';
import EmptyUpload from './empty-upload';
import UploadedImage from './uploaded-image';
import { ApiError, ApiErrorData } from '@/types/api';

const ImageUpload = ({
  setOpen,
  propertyImages,
  setMetadata,
  setPropertyImages,
  insertImageInBucket,
  handleReportImageDelete,
  isDeleteVisible,
}: {
  setOpen: (data: boolean) => void;
  setMetadata: (data: Photo) => void;
  propertyImages: Photo[];
  handleReportImageDelete: (image: Photo) => Promise<void>;
  setPropertyImages: (data: (prev: Photo[]) => Photo[]) => void;
  insertImageInBucket: (
    file: File,
    imageReserve: Photo,
    timeStamp: number,
  ) => Promise<{ data: Photo; error?: ApiErrorData }>;
  isDeleteVisible: boolean;
}) => {
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);

  const handleReserveButtonClick = (image: Photo) => {
    setMetadata(image);
    setOpen(true);
  };

  return (
    <div className="grid grid-cols-3 gap-x-[60px] gap-y-11">
      {propertyImages &&
        propertyImages.map((image, index) => (
          <div
            key={image.id}
            className="min-h-[340px] w-[363px]"
          >
            {image.url ? (
              <UploadedImage
                image={image}
                handleReportImageDelete={handleReportImageDelete}
                isDeleteVisible={isDeleteVisible}
              />
            ) : loadingIndexes.includes(index) ? (
              <div className="flex min-h-[248px] items-center justify-center">
                <Icon
                  icon={'spin'}
                  className="inline h-8 w-8 animate-spin fill-blue-600 text-slate-200 dark:text-slate-600"
                />
              </div>
            ) : (
              <EmptyUpload
                index={index}
                image={image}
                handleReserveButtonClick={handleReserveButtonClick}
                setLoadingIndexes={setLoadingIndexes}
                insertImageInBucket={insertImageInBucket}
                setPropertyImages={setPropertyImages}
              />
            )}
            <BottomInfoCard
              name={image.image_name}
              description={image.description}
              note={image.note}
            />
          </div>
        ))}
    </div>
  );
};

export default ImageUpload;
