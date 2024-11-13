'use client';
import PropertyImages from '@/components/(app)/orders/[id]/property-images';
import React, { useState } from 'react';
import {
  deleteImageInReport,
  getImages,
  createPropertyImageFromReserve as createPropertyImageFromReserveAction,
  getOrderReport,
  addPropertyImageData,
  updatePropertyImage,
  uploadToBucket,
} from './action';
import { notify } from '@/components/ui/toastify/toast';
import MetadataErrorDialog from '@/components/(app)/orders/[id]/property-images/metadata-error-dialog';
import { ApiErrorData } from '@/types/api';
import { FNM_IMAGE_STATUS } from '@/utils/constants';

const PropertyImagesPage = ({ params }: { params: { id: string } }) => {
  // TODO: Refactor. It looks like all this logic belongs to PropertyImages component. It should be moved to component PropertyImages, including also MetadataErrorDialog component.
  const [open, setOpen] = useState(false);

  const getImageOfOrder = async () => {
    const response = await getImages(params.id);
    return response;
  };

  const getCurrentReport = async () => {
    const { data, error } = await getOrderReport(params.id);
    if (data) {
      return data;
    }
    if (error) {
      notify({
        title: 'Error',
        text: 'Error fetching orders.',
        type: 'error',
      });
    }
    return error;
  };

  const uploadMetaDataToFannieMae = async (
    file: File | null,
    metadata: Photo,
    imageUrl: string,
  ) => {
    let newMetaData;
    if (metadata.uploaded_metadata) {
      newMetaData = metadata.uploaded_metadata;
    } else {
      newMetaData = {
        timestamp: Math.floor(Date.now() / 1000),
        description: 'Description of the photo',
        photoTags: metadata.photoTags,
        photoType: metadata.photoType,
        geoPosition: metadata.geoPosition,
        inspectionId: metadata.inspectionId,
        alwaysRequired: metadata.alwaysRequired,
        photoNotAvailable: metadata.photoNotAvailable,
        parentObjectJsonPath: metadata.parentObjectJsonPath,
      };
    }

    const formData = new FormData();
    formData.append('metadata', JSON.stringify(newMetaData));
    if (file) {
      formData.append('image', file);
    }
    if (imageUrl.trim() !== '') {
      formData.append('imageUrl', imageUrl);
    }

    try {
      const metadataResponse = await fetch('/api/upload-image-metadata', {
        method: 'POST',
        body: formData,
      });

      const metadataResult = await metadataResponse.json();
      if (metadataResult.error) {
        setOpen(true);
        return {
          error: 'Something went wrong',
        };
      }

      if (metadataResult.data.photoId) {
        notify({
          title: 'Success',
          text: 'Image successfully uploaded. Please wait for approval.',
          type: 'success',
        });
        return metadataResult.data;
      }
    } catch (error) {
      notify({
        title: 'Error',
        text: 'Something went wrong.',
        type: 'error',
      });
      return error;
    }
  };

  const insertImageInBucket = async (file: File, propertyImage: Photo, timeStamp: number) => {
    const fileExtension = file.name.split('.').pop();

    const response: IMetaDataResponse = await uploadMetaDataToFannieMae(file, propertyImage, '');

    if (!response.error && response.photoId && response.uploadUrl) {
      let formData = new FormData();
      formData.append('file', file);

      const { data: storeBucket, error: bucketError } = await uploadToBucket(
        formData,
        timeStamp,
        params.id,
      );
      if (bucketError) {
        return {
          data: {} as Photo,
          error: bucketError as ApiErrorData,
        };
      }
      const fileInfo: { timeStamp: number; fileExtension: string | undefined } = {
        timeStamp,
        fileExtension,
      };
      if (storeBucket.id && !propertyImage.id) {
        let submitData = {
          order_id: params.id,
          image_group: propertyImage.parentObjectJsonPath,
          image_type: propertyImage.photoType,
          uploaded_metadata: response,
          fnm_status: FNM_IMAGE_STATUS.META_VERIFIED,
        };
        const { data, error } = await addPropertyImageData(submitData, fileInfo);
        return {
          data,
          error,
        };
      } else {
        const { data, error } = await updatePropertyImage(
          propertyImage.id as string,
          fileInfo,
          response,
          params.id,
        );
        return {
          data,
          error,
        };
      }
    }

    return {
      data: {} as Photo,
      error: undefined,
    };
  };

  const createPropertyImageFromReserve = async (
    selectedImage: OrderImage,
    metadata: Photo,
  ): Promise<{ data: Photo | null; error: ApiErrorData | null | string }> => {
    // TODO: Refactor. Create separate action for all logic (list of this functions only backend functions). No reasons create multiple step by step requests.
    try {
      const timeStamp = Date.now();
      const fileExtension = selectedImage.image_name.split('.').pop();
      if (selectedImage.url) {
        const response: IMetaDataResponse = await uploadMetaDataToFannieMae(
          null,
          metadata,
          selectedImage.url,
        );

        if (response.error) {
          return {
            data: null,
            error: response.error,
          };
        }
        const fileInfo: { timeStamp: number; fileExtension: string | undefined } = {
          timeStamp,
          fileExtension,
        };

        const { data, error } = await createPropertyImageFromReserveAction(
          params.id,
          selectedImage.image_name,
          fileInfo,
        );
        if (response.photoId && response.uploadUrl && !metadata.id) {
          if (error) {
            return { data: null, error: error };
          }

          const submitData = {
            order_id: params.id,
            image_group: response.imageMeta.parentObjectJsonPath,
            image_type: response.imageMeta.photoType,
            uploaded_metadata: response,
            fnm_status: FNM_IMAGE_STATUS.META_VERIFIED,
          };

          const { data: uploadedData, error: uploadedError } = await addPropertyImageData(
            submitData,
            fileInfo,
          );
          if (uploadedError) {
            return { data: null, error: uploadedError };
          }

          return { data: { ...uploadedData, url: data?.signedUrl }, error: null };
        } else {
          // IF METADATA ALREADY UPLOADED

          const { data: uploadedData, error: uploadedError } = await updatePropertyImage(
            metadata.id as string,
            fileInfo,
            response,
            params.id,
          );
          if (uploadedError) {
            return { data: null, error: uploadedError };
          }

          return { data: { ...uploadedData, url: data?.signedUrl }, error: null };
        }
      }

      // Handle case where selectedImage.url is not defined
      return { data: null, error: { details: 'Selected image URL is missing.' } as ApiErrorData };
    } catch (err) {
      return {
        data: null,
        error: err as ApiErrorData,
      };
    }
  };

  const handleDeleteImage = async (img: Photo) => {
    if (!img.imageName) {
      return {
        data: [],
        error: undefined,
      };
    }
    const submitData: IDeleteImage = {
      parentObjectJsonPath: img.parentObjectJsonPath,
      id: img.id,
      photoType: img.photoType,
      imageName: img.imageName,
    };

    const { data, error } = await deleteImageInReport(params.id, submitData);
    return {
      data,
      error,
    };
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10">
      <PropertyImages
        handleDeleteImage={handleDeleteImage}
        createPropertyImageFromReserve={createPropertyImageFromReserve}
        getImageOfOrder={getImageOfOrder}
        getCurrentReport={getCurrentReport}
        insertImageInBucket={insertImageInBucket}
      />

      {open && (
        <MetadataErrorDialog
          open={open}
          handleClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyImagesPage;
