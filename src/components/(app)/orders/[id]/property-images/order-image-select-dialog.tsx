import {
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Icon } from '@/components/ui/icon';
import { notify } from '@/components/ui/toastify/toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ApiResponseData } from '@/types/api';
import { IMAGE_RESERVE } from '@/utils/constants';
import { AlertDialog } from '@radix-ui/react-alert-dialog';
import _cloneDeep from 'lodash/cloneDeep';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const OrderImageSelectDialog = ({
  getImageOfOrder, // TODO: Refactor. It would be more appropriate if this function were defined here. Let's get rid of the extra props in this component.
  open,
  setOpen,
  setSelectedImage,
  selectedImage,
  handleUploadReportImage,
  disabled,
}: {
  getImageOfOrder: () => Promise<ApiResponseData>;
  open: boolean;
  setOpen: (data: boolean) => void;
  setSelectedImage: (data: OrderImage | undefined) => void;
  selectedImage: OrderImage | undefined;
  handleUploadReportImage: () => void;
  disabled: boolean;
}) => {
  const [images, setImages] = useState<OrderImage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [groupedImages, setGroupedImages] = useState<any>(null);

  useEffect(() => {
    getImagesByOrder();
  }, []);

  const getImagesByOrder = async () => {
    setLoading(true);
    try {
      const { data, error } = await getImageOfOrder();
      if (error) {
        notify({
          title: 'Error',
          text: 'Something went wrong.',
          type: 'error',
        });
        return;
      }
      if (data) {
        setImages(data);
      }
      setLoading(false);
    } catch {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (images) {
      const imageReserve: ImageReserve = _cloneDeep(IMAGE_RESERVE);
      const newImages = _cloneDeep(images);
      newImages?.forEach((image) => {
        const group = imageReserve[image.image_group];
        if (group) {
          const type = group.typeOfImages.find((t: any) => t.image_type === image.image_type);
          if (type) {
            image.new_image_name = type.image_name;
            image.new_description = image.is_other ? image.description : type.description;
            image.note = type.note ? type.note : '';
          }
        }
      });

      const groupedImg = newImages.reduce((acc: GroupedImages, image: any) => {
        const group = image.image_group;
        if (!acc[group]) {
          acc[group] = {
            title: imageReserve[group].title,
            images: [],
          };
        }
        acc[group].images.push(image);
        return acc;
      }, {});
      setGroupedImages(groupedImg);
    }
  }, [images]);

  const handleImageClick = (image: OrderImage) => {
    setSelectedImage(image.id === selectedImage?.id ? undefined : image);
  };
  return (
    <div>
      <AlertDialog
        open={open}
        onOpenChange={() => setOpen(!open)}
      >
        <AlertDialogContent className=" h-[850px] min-h-[50%] max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-extrabold text-slate-900">
              Upload photo from reserve
            </AlertDialogTitle>
            <p className="text-sm font-normal text-slate-900">
              Select a photo from the reserve to upload to Image Property.
            </p>
          </AlertDialogHeader>

          {loading ? (
            <div className="flex w-full items-center justify-center">
              <Icon
                icon={'spin'}
                className="inline h-8 w-8 animate-spin fill-blue-600 text-slate-200 dark:text-slate-600"
              />
            </div>
          ) : (
            <div className=" overflow-x-hidden overflow-y-scroll">
              {groupedImages &&
                Object.entries(groupedImages).map(([group, data]: any) => (
                  <div
                    key={group}
                    className="pl-4"
                  >
                    <h2 className=" mb-4 px-4 text-base font-semibold text-slate-900">
                      {data.title}
                    </h2>
                    <div className="flex flex-wrap gap-2 px-4">
                      {data.images.map((image: OrderImage) => (
                        <div
                          key={image.id}
                          className={`relative h-[280px] w-[260px] cursor-pointer rounded-md`}
                          onClick={() => handleImageClick(image)}
                        >
                          <Image
                            className="h-40 w-[260px]  rounded-md object-cover"
                            src={image.url || ''}
                            height={160}
                            width={160}
                            alt="Preview"
                            priority
                          />
                          <h3 className="mt-2 flex text-xs font-semibold text-slate-900">
                            <span> {image.new_image_name}</span>
                            {image.note && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <div className="mx-1.5 h-[18px] w-[18px]">
                                      <Icon
                                        icon="chevron-info"
                                        size={'sm'}
                                        className="mt-1 h-[14px] w-[14px] text-sky-500"
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="top"
                                    align="start"
                                  >
                                    {image.note}
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </h3>
                          <p className="h-36 text-xs font-normal text-slate-400">
                            {image.is_other ? image.description : image.new_description}
                          </p>
                          <div className="absolute right-2 top-2">
                            <Checkbox
                              className={`${image.id === selectedImage?.id && 'mt-1.5'} h-6 w-6 checked:border-0 checked:bg-sky-500`}
                              checked={image.id === selectedImage?.id}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          <AlertDialogFooter className="sticky flex items-end justify-center">
            <Button
              variant={'outline'}
              onClick={() => setOpen(false)}
              disabled={disabled}
              className="h-9 w-full text-base font-bold"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadReportImage}
              disabled={disabled || loading}
              className="h-9 w-full text-base font-bold"
            >
              {disabled ? 'Uploading...' : 'Upload Selected'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default OrderImageSelectDialog;
