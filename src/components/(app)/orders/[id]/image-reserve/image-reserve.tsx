import React, { useEffect, useState, useRef } from 'react';
import SectionHeader from '../section-header';
import { Input } from '@/components/ui/input';
import { Icon } from '@/components/ui/icon';
import ImageReserveSectionCard from './section-card';
import { IMAGE_RESERVE } from '@/utils/constants';
import {
  getReserveImages,
  getThumbnailImagesByImageGroup,
} from '@/app/(app)/orders/[id]/image-reserve/action';
import { cloneDeep } from 'lodash';
import { useParams } from 'next/navigation';

const ImageReserve = () => {
  const [filterData, setFilterData] = useState<ImageReserve>(cloneDeep(IMAGE_RESERVE));
  const [filteredKeys, setFilteredKeys] = useState(Object.keys(filterData));
  const filterDataRef = useRef<ImageReserve>(filterData);
  const params: { id: string } = useParams();

  useEffect(() => {
    filterDataRef.current = filterData;
  }, [filterData]);

  useEffect(() => {
    const getImages = async () => {
      return await getReserveImages(params.id);
    };

    const getThumbnail = async () => {
      const thumbnailResponse = await getThumbnailImagesByImageGroup(params.id);
      return thumbnailResponse.data;
    };

    const handleGetAllImage = async () => {
      const { data, error } = await getImages();
      if (error) {
        return;
      }

      const thumbnailResponse: StoreImage[] = await getThumbnail();
      if (thumbnailResponse && thumbnailResponse.length) {
        const addThumbnailImageReserve: ImageReserve = cloneDeep(filterDataRef.current);
        Object.keys(addThumbnailImageReserve).forEach((key) => {
          const matchingImage = thumbnailResponse?.find(
            (image: { identifier: string; number_of_images: number; first_image_url: string }) =>
              image.identifier === key,
          );
          if (matchingImage) {
            addThumbnailImageReserve[key].url = matchingImage.first_image_url;
          }
        });
        setFilterData(addThumbnailImageReserve);
      }

      const imageGroupCounts: {
        [key: string]: number;
      } = data.orders_images.reduce((counts: { [key: string]: number }, image: OrderImage) => {
        counts[image.image_group] = (counts[image.image_group] || 0) + 1;
        return counts;
      }, {});

      setFilterData((prev: ImageReserve) => {
        const newImageReserve = cloneDeep(prev);
        Object.keys(newImageReserve).forEach((key) => {
          if (imageGroupCounts[key] !== undefined) {
            newImageReserve[key].noOfImageUpload = imageGroupCounts[key];
          }
        });
        return newImageReserve;
      });
    };

    handleGetAllImage();
  }, [params.id]);

  const handleFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    const keys = Object.keys(filterData);
    const filteredKeys = keys.filter((key) =>
      key.toLowerCase().includes(searchTerm.replaceAll(' ', '-')),
    );
    setFilteredKeys(filteredKeys);
  };

  return (
    <div>
      <SectionHeader
        title="Image Reserve"
        description="Prepare in advance an archive of images for the report "
      >
        <div className="flex items-center">
          <div className="relative ">
            <Input
              maxLength={50}
              onChange={handleFilter}
              type="text"
              placeholder="Type to Search"
              className="h-9 w-[394px] placeholder:font-medium placeholder:text-slate-400 focus:border-0 focus-visible:border-0"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
              <Icon
                icon="search"
                size="sm"
                className="me-2.5 text-slate-400"
              />
            </div>
          </div>
        </div>
      </SectionHeader>
      <main className="flex flex-col items-center justify-between">
        {filteredKeys.map((key, index) => (
          <ImageReserveSectionCard
            key={index}
            path={key}
            imageUploadData={filterData[key]}
          />
        ))}
      </main>
    </div>
  );
};

export default ImageReserve;
