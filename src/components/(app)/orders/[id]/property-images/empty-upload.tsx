import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Input } from '@/components/ui/input';
import { notify } from '@/components/ui/toastify/toast';
import { ApiErrorData } from '@/types/api';
import { FNM_IMAGE_STATUS } from '@/utils/constants';
import { maxFileSize } from '@/utils/helper';
import { cloneDeep } from 'lodash';
import React, { Dispatch, SetStateAction, useRef } from 'react';

const EmptyUpload = ({
  index,
  image,
  handleReserveButtonClick,
  setLoadingIndexes,
  insertImageInBucket,
  setPropertyImages,
}: {
  index: number;
  image: Photo;
  handleReserveButtonClick: (image: Photo) => void;
  setLoadingIndexes: Dispatch<SetStateAction<number[]>>;
  insertImageInBucket: (
    file: File,
    imageReserve: Photo,
    timeStamp: number,
  ) => Promise<{ data: Photo; error?: ApiErrorData }>;
  setPropertyImages: (data: (prev: Photo[]) => Photo[]) => void;
}) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleButtonClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    image: Photo,
    index: number,
  ) => {
    const timeStamp = Date.now();
    const file = event?.target?.files?.[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        notify({
          title: 'Error',
          text: 'Only JPG and PNG files are allowed.',
          type: 'error',
        });
        return;
      }

      if (file.size > maxFileSize(10)) {
        notify({
          title: 'Error',
          text: 'File size must be less than 10MB.',
          type: 'error',
        });
        return;
      }
      try {
        setLoadingIndexes((prev) => [...prev, index]);
        const { data, error } = await insertImageInBucket(file, image, timeStamp);
        if (error) {
          notify({
            title: 'Error',
            text: 'Error while uploading image.',
            type: 'error',
          });
          return;
        }
        const reader = new FileReader();
        if (data) {
          reader.onload = () => {
            const base64URL = reader.result as string;

            setPropertyImages((prev: Photo[]): Photo[] => {
              const updatedPropertyImages = cloneDeep(prev);
              updatedPropertyImages[index] = {
                ...updatedPropertyImages[index],
                id: data.id,
                url: base64URL,
                imageName: data.image_name,
                fnm_status: FNM_IMAGE_STATUS.META_VERIFIED,
                uploaded_metadata: data.uploaded_metadata,
              };
              return updatedPropertyImages;
            });
          };
          reader.readAsDataURL(file);
        }

        setLoadingIndexes((prev) => prev.filter((i) => i !== index));
      } catch (e) {
        setLoadingIndexes((prev) => prev.filter((i) => i !== index));
      }
    }
  };

  return (
    <div className="relative flex h-[248px] w-[363px] flex-col items-center justify-center space-y-[15px] rounded-lg border border-dashed">
      <div className="flex h-[74px] w-[234px] flex-col items-center text-center leading-[19px]">
        <Icon
          icon="chevron-image"
          className="h-[26px] w-[26px] text-slate-200"
        />
        <p className="mt-2.5 text-slate-400">Upload a file or Take a picture PNG, JPG up to 10MB</p>
      </div>
      <div className="mt-5 flex w-[341px] gap-[11px]">
        <Button
          variant={'outline'}
          size={'sm'}
          className="w-full"
          onClick={() => handleReserveButtonClick(image)}
        >
          <Icon
            size={'sm'}
            icon="chevron-image"
            className="h-4 w-4"
          />
          <span className="ms-2.5 text-base font-bold">Upload from reserve</span>
        </Button>
      </div>
      <div className="mt-5 flex gap-[11px]">
        <Input
          type="file"
          ref={(el) => {
            fileInputRefs.current[index] = el;
          }}
          className="hidden"
          onChange={(e) => handleFileChange(e, image, index)}
          accept=".jpg,.jpeg,.png"
        />
        <Button
          variant={'outline'}
          className="mx-2.5 h-9 w-[343px] border border-sky-500 px-4  text-base font-bold"
          onClick={() => handleButtonClick(index)}
        >
          <Icon
            icon="folders"
            size={'sm'}
            className="h-4 w-4 text-sky-500"
          />
          <span className="ms-2.5 text-base font-bold">Upload a file</span>
        </Button>
      </div>
    </div>
  );
};

export default EmptyUpload;
