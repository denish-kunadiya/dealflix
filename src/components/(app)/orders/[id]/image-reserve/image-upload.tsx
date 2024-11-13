'use client';
import React, { useEffect, useRef, useState } from 'react';
import SectionHeader from '../section-header';
import { IMAGE_RESERVE, EMPTY_IMAGE_RESERVE } from '@/utils/constants';
import { Icon } from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { ApiResponseData } from '@/types/api';
import ImageReserveBlock from './image-reserve-block';
import {
  addImageComment,
  getThumbnailImageUrls,
  insertReserveImage,
} from '@/app/(app)/orders/[id]/image-reserve/action';
import { notify } from '@/components/ui/toastify/toast';
import { cloneDeep } from 'lodash';
import { useParams } from 'next/navigation';

const ImageUpload = () => {
  const [imageReserve, setImageReserve] = useState<TypesOfImages[] | []>([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);

  const [images, setImages] = useState<TypesOfImages[] | []>([]);
  const params: { id: string; imageGroup: string } = useParams();

  useEffect(() => {
    const getImages = async () => {
      let images = await getThumbnailImageUrls(params.id, params.imageGroup);
      if (images.success) {
        setImages(images.data);
      }
    };
    getImages();
  }, [params.id, params.imageGroup]);

  useEffect(() => {
    const checkButtonCondition = () => {
      for (let image of imageReserve) {
        if ((image.image_type === 'OTHER' || image.is_other) && !image.url) {
          return true;
        }
      }
      return false;
    };

    setIsButtonDisabled(checkButtonCondition());
  }, [imageReserve]);

  useEffect(() => {
    if (params.imageGroup && (IMAGE_RESERVE as ImageReserve)[params.imageGroup]?.typeOfImages) {
      setImageReserve(cloneDeep((IMAGE_RESERVE as ImageReserve)[params.imageGroup]?.typeOfImages));
    }
  }, [params.imageGroup]);

  const imageReserveRef = useRef(imageReserve);

  useEffect(() => {
    imageReserveRef.current = imageReserve;
  }, [imageReserve]);

  useEffect(() => {
    if (images.length) {
      const apiImagesMap = images.reduce((map: { [key: string]: TypesOfImages }, img) => {
        map[img.image_type] = img;
        return map;
      }, {});

      const mergedImagesMap = new Map();
      imageReserveRef.current.forEach((localImg) => {
        const apiImg = apiImagesMap[localImg.image_type];
        if (apiImg) {
          const shouldOverrideDescription = !localImg.image_type.startsWith('OTHER');
          const mergedImg = {
            ...apiImg,
            description: shouldOverrideDescription ? localImg.description : apiImg.description,
            image_name: shouldOverrideDescription ? localImg.image_name : apiImg.image_name,
            api_image_name: apiImg.image_name,
            note: localImg.note,
          };
          mergedImagesMap.set(mergedImg.id || mergedImg.image_type, mergedImg);
        } else {
          mergedImagesMap.set(localImg.id || localImg.image_type, localImg);
        }
      });

      images.forEach((apiImg) => {
        if (
          apiImg.image_type.startsWith('OTHER') ||
          !mergedImagesMap.has(apiImg.id || apiImg.image_type)
        ) {
          mergedImagesMap.set(apiImg.id || apiImg.image_type, apiImg);
        }
      });

      const finalMergedImages = Array.from(mergedImagesMap.values());
      setImageReserve(finalMergedImages);
    }
  }, [images]);

  const handleAddImage = () => {
    setImageReserve((prev) => [
      ...prev,
      {
        ...EMPTY_IMAGE_RESERVE,
        image_type: `OTHER`,
      },
    ]);
  };

  const insertImage = async (
    file: File,
    imageReserve: TypesOfImages,
    imageGroup: string,
    timeStamp: number,
  ) => {
    const formData = new FormData();
    formData.append('file', file);
    const data: ApiResponseData = await insertReserveImage(
      formData,
      params.id,
      imageReserve,
      imageGroup,
      timeStamp,
    );
    if (data.success) {
      return data;
    } else {
      notify({
        title: 'Error',
        text: 'Something went wrong in image upload.',
        type: 'error',
      });
      return {
        data: null,
        error: 'Something went wrong',
      };
    }
  };

  const addComment = async (comment: string, imageId: string) => {
    await addImageComment(comment, imageId);
  };

  return (
    <div>
      <SectionHeader
        title={(IMAGE_RESERVE as ImageReserve)[params.imageGroup].title}
        description="Prepare in advance an archive of images for the report "
      />
      <div className="grid grid-cols-3 gap-[60px]">
        <ImageReserveBlock
          path={params.imageGroup}
          setImageReserve={setImageReserve}
          insertImage={insertImage}
          addComment={addComment}
          imageReserve={imageReserve}
        />
        <div className="grid gap-[60px]">
          <div className="flex h-[248px] w-[363px] flex-col items-center justify-center gap-5">
            <p className="w-[257px] text-slate-400">
              Upload a photo according to the sample shown if necessary.
            </p>
            <Button
              size={'sm'}
              variant={'ghost'}
              className="h-12 w-full bg-sky-50"
              onClick={handleAddImage}
              disabled={isButtonDisabled}
            >
              <Icon
                size={'sm'}
                icon="plus"
                className="h-4 w-4 text-sky-500"
              />
              <span className="ms-2 text-lg font-bold text-sky-500"> Add Image </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;
