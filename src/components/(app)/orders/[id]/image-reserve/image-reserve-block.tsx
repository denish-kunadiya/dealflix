import Spinner from '@/components/shared/spinner';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import BottomInfoCard from './bottom-info-card';
import { Input } from '@/components/ui/input';
import { maxFileSize } from '@/utils/helper';
import { notify } from '@/components/ui/toastify/toast';
import { ApiResponseData } from '@/types/api';
import { deleteOrderImage } from '@/app/(app)/orders/[id]/image-reserve/action';
import { EMPTY_IMAGE_RESERVE } from '@/utils/constants';

type IImageReserveBlock = {
  setImageReserve: Dispatch<SetStateAction<TypesOfImages[]>>;
  imageReserve: TypesOfImages[];
  path: string;
  insertImage: (
    file: File,
    imageReserve: TypesOfImages,
    imageGroup: string,
    timeStamp: number,
  ) => Promise<ApiResponseData | { data: null; error: string }>;
  addComment: (comment: string, imageId: string) => Promise<void>;
};

const ImageReserveBlock = ({
  path,
  setImageReserve,
  insertImage,
  addComment,
  imageReserve,
}: IImageReserveBlock) => {
  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleUploadButtonClick = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = event?.target?.files?.[0];
    const timeStamp = Date.now();

    try {
      if (file) {
        const updatedImageReserve = [...imageReserve];
        updatedImageReserve[index] = {
          ...imageReserve[index],
          image_type: imageReserve[index].is_other ? 'OTHER' : imageReserve[index].image_type,
        };

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
            text: 'File size must be less than 5MB.',
            type: 'error',
          });
          return;
        }
        setLoadingIndexes((prev) => [...prev, index]);
        const data = await insertImage(file, updatedImageReserve[index], path, timeStamp);

        const reader = new FileReader();
        reader.onload = () => {
          const base64URL = reader.result as string;

          const updatedImageReserve = [...imageReserve];

          updatedImageReserve[index] = {
            ...updatedImageReserve[index],
            ...data.data[0],
            description: updatedImageReserve[index].description,
            image_name: updatedImageReserve[index].image_name,
            api_image_name: data.data[0].image_name,
            url: base64URL,
            note: updatedImageReserve[index].note,
          };

          setImageReserve(updatedImageReserve);
          setLoadingIndexes((prev) => prev.filter((i) => i !== index));
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      setLoadingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  const handleDeleteImage = async (img: TypesOfImages, index: number) => {
    const newData = {
      image_type: img.image_type,
      id: img.id,
      order_id: img.order_id,
      api_image_name: img.api_image_name,
    };
    const data = await deleteOrderImage(newData);
    if (data.error) {
      return;
    }
    const updatedImageReserve = [...imageReserve];
    updatedImageReserve[index] = updatedImageReserve[index].image_type.startsWith('OTHER')
      ? {
          ...EMPTY_IMAGE_RESERVE,
          url: '',
        }
      : {
          ...updatedImageReserve[index],
          image_name: updatedImageReserve[index].image_name,
          id: null,
          order_id: '',
          user_id: '',
          url: '',
          api_image_name: '',
        };

    setImageReserve(updatedImageReserve);
  };

  const handleCommentChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
    image_type: TypesOfImages,
  ) => {
    const { value } = event.target;
    setImageReserve((prev) => {
      const newImageReserve = [...prev];
      newImageReserve[index].description = value;
      newImageReserve[index].image_type = image_type.image_type;
      newImageReserve[index].image_name = 'other';
      return newImageReserve;
    });
    if (image_type.id) {
      await addComment(value, image_type.id);
    }
  };

  return (
    <>
      {imageReserve.map((img, index) => (
        <div
          key={`${img.id}_${img.image_name}`}
          className="w-[363px]"
        >
          <div className="relative flex h-[160px] w-[363px] flex-col items-center justify-center space-y-[15px] rounded-lg border border-dashed">
            {img.url ? (
              <>
                <img
                  src={img.url as string}
                  height={100}
                  width={100}
                  alt="Preview"
                  className="h-full w-full rounded-lg"
                />
                <div className="absolute flex items-center justify-center gap-2.5 text-sm text-emerald-400">
                  <span>Image uploaded</span>
                  <Icon
                    size={'sm'}
                    icon={'double-check'}
                  />
                </div>
                <Button
                  onClick={() => handleDeleteImage(img, index)}
                  className="absolute -top-[10px] right-0 bg-transparent hover:bg-transparent"
                >
                  <Icon
                    size={'sm'}
                    icon="trash"
                    className="text-red-500"
                  />
                </Button>
              </>
            ) : loadingIndexes.includes(index) ? (
              <Spinner />
            ) : (
              <>
                <div className="flex h-[74px] w-[234px] flex-col items-center text-center leading-[19px]">
                  <Icon
                    size={'sm'}
                    icon="chevron-image"
                    className="h-[26px] w-[26px] text-slate-200"
                  />
                  <p className="mt-2.5 text-slate-400">
                    Upload a file or Take a picture PNG, JPG up to 10MB
                  </p>
                </div>
                <div className="mt-5 flex gap-[11px]">
                  <input
                    type="file"
                    ref={(el) => {
                      fileInputRefs.current[index] = el;
                    }}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, index)}
                    accept=".jpg,.jpeg,.png"
                  />
                  <Button
                    variant={'outline'}
                    className="w-[166px] border"
                    size={'sm'}
                    onClick={() => handleUploadButtonClick(index)}
                  >
                    <Icon
                      size={'sm'}
                      icon="folders"
                      className="h-4 w-4"
                    />
                    <span className="ms-2">Upload a file</span>
                  </Button>
                </div>
              </>
            )}
          </div>
          {!img.is_other ? (
            <>
              <BottomInfoCard
                name={img.image_name}
                description={img.description}
                note={img.note}
              />
            </>
          ) : (
            <>
              <p className="mb-2 mt-5 text-sm text-slate-900">Comment</p>
              <Input
                onBlur={(e) => {
                  handleCommentChange(e, index, img);
                }}
                disabled={!img.url}
                maxLength={150}
                placeholder="..."
                defaultValue={img.description || ''}
              />
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default ImageReserveBlock;
