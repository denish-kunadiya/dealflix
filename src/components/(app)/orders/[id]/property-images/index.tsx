'use client';
import SectionHeader from '@/components/(app)/orders/[id]/section-header';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import React, { useEffect, useState } from 'react';
import ImageUpload from './image-upload';
import OrderImageSelectDialog from './order-image-select-dialog';
import { notify } from '@/components/ui/toastify/toast';
import { FNM_IMAGE_STATUS, IMAGE_RESERVE } from '@/utils/constants';
import {
  getReportStatus,
  updateReportStatusByOrderId,
  updatePropertyImageFnmStatus,
} from '@/app/(app)/orders/[id]/property-images/action';
import { useParams } from 'next/navigation';
import { cloneDeep } from 'lodash';
import { ApiError, ApiErrorData, ApiResponseData } from '@/types/api';

const PropertyImages = ({
  getImageOfOrder,
  getCurrentReport,
  insertImageInBucket,
  createPropertyImageFromReserve,
  handleDeleteImage,
}: {
  getImageOfOrder: () => Promise<ApiResponseData>;
  getCurrentReport: () => Promise<IInspectionReport>;
  handleDeleteImage: (
    image: Photo,
  ) => Promise<{ data: IBucketImage[]; error: ApiErrorData | undefined }>;
  insertImageInBucket: (
    file: File,
    imageReserve: Photo,
    timeStamp: number,
  ) => Promise<{ data: Photo; error: ApiErrorData } | { data: Photo; error: ApiError | undefined }>;
  createPropertyImageFromReserve: (
    selectedImage: OrderImage,
    metadata: Photo,
  ) => Promise<{ data: Photo | null; error: ApiErrorData | null | string }>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [propertyImages, setPropertyImages] = useState<Photo[] | []>([]);
  const [selectedImage, setSelectedImage] = useState<OrderImage | undefined>();
  const [metadata, setMetadata] = useState<Photo | null>(null);
  const [loading, setLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isDeleteVisible, setIsDeleteVisible] = useState(false);
  const { id }: { id: string } = useParams();

  useEffect(() => {
    const fetchReportData = async () => {
      const data: IInspectionReport = await getCurrentReport();
      const propertyImageData = data?.fnm_required_photos?.map((report) => {
        report.description = '';
        report.note = '';
        report.image_name = '';
        Object.values(cloneDeep(IMAGE_RESERVE)).forEach((reserve) => {
          reserve.typeOfImages.map((image) => {
            if (image.image_type === report.photoType) {
              report.description = image.description;
              report.note = image.note;
              report.image_name = image.image_name;
            }
            switch (report.photoType) {
              case 'ATTACHED_GARAGE_EXTERIOR':
              case 'DETACHED_GARAGE_EXTERIOR':
              case 'BUILTIN_GARAGE_EXTERIOR':
                report.description = `Image of the outside of the garage. Should include the entry door. Image type name varies depending upon the name of the garage type.`;
                report.note =
                  'If the garage was converted to living space, then evidence of this should be captured through this image. At a minimum provide images of the exterior of the garage, showing if the garage entry has been changed or removed.';
                report.image_name = 'Image of outside of garage';
                break;

              case 'ATTACHED_GARAGE_INTERIOR':
              case 'DETACHED_GARAGE_INTERIOR':
              case 'BUILTIN_GARAGE_INTERIOR':
                report.description = `Image of the inside of the garage. Include images from opposite corners of the interior to ensure adequate coverage.Image type name varies depending upon the name of the garage type.`;
                report.note =
                  'If the garage was converted, then evidence of this should be captured through this image. The interior image should show the level of completion of the converted space.';
                report.image_name = 'Image of inside of garage';
                break;

              case 'SIDING_GARAGE_DEFICIENCY':
              case 'WINDOWS_GARAGE_DEFICIENCY':
              case 'DOORS_GARAGE_DEFICIENCY':
              case 'GARAGE_DOOR_GARAGE_DEFICIENCY':
              case 'EXTERIOR_WALLS_GARAGE_DEFICIENCY':
              case 'INTERIOR_WALLS_GARAGE_DEFICIENCY':
              case 'CEILING_GARAGE_DEFICIENCY':
              case 'ROOF_GARAGE_DEFICIENCY':
              case 'FOUNDATION_GARAGE_DEFICIENCY':
                report.description = `Image of all garage deficiencies identified.
          Image type name varies depending on the type of car storage update selected.`;
                report.note = '';
                report.image_name = 'Image of car storage deficiency';
                break;

              case 'FLOORING_INTERIOR_DEFICIENCY':
              case 'PLUMBING_FIXTURES_INTERIOR_DEFICIENCY':
              case 'ELECTRICAL_FIXTURES_INTERIOR_DEFICIENCY':
              case 'CABINET_COUNTERTOPS_INTERIOR_DEFICIENCY':
              case 'APPLIANCES_INTERIOR_DEFICIENCY':
              case 'WALLS_INTERIOR_DEFICIENCY':
              case 'CEILING_INTERIOR_DEFICIENCY':
              case 'SHOWER_TUB_SURROUND_INTERIOR_DEFICIENCY':
                report.description = `Image to capture each interior deficiency identified. Ensure enough images are captured to show the location and extent of the damage.
          Image type name varies depending upon the name of the deficient component.`;
                report.note = '';
                report.image_name = 'Image of interior deficiency';
                break;

              case 'FLOORING_INTERIOR_UPDATE':
              case 'PLUMBING_FIXTURES_INTERIOR_UPDATE':
              case 'ELECTRICAL_FIXTURES_INTERIOR_UPDATE':
              case 'CABINET_COUNTERTOPS_INTERIOR_UPDATE':
              case 'APPLIANCES_INTERIOR_UPDATE':
              case 'WALLS_INTERIOR_UPDATE':
              case 'CEILING_INTERIOR_UPDATE':
                report.description = `Image of the interior update identified within the room. 
          Image type name varies depending on the type of interior update selected.`;
                report.note = '';
                report.image_name = 'Image of interior update';
                break;

              case 'DOORS_EXTERIOR_UPDATE':
              case 'SIDING_EXTERIOR_UPDATE':
              case 'WALLS_EXTERIOR_UPDATE':
              case 'ROOF_EXTERIOR_UPDATE':
              case 'FOUNDATION_EXTERIOR_UPDATE':
              case 'FENCE_EXTERIOR_UPDATE':
              case 'WINDOWS_EXTERIOR_UPDATE':
                report.description = `Image of the exterior update identified on the structure.Image type name varies depending on the type of exterior update selected.`;
                report.note = '';
                report.image_name = 'Image of exterior update';
                break;

              case 'FOUNDATION_EXTERIOR_DEFICIENCY':
              case 'ROOF_EXTERIOR_DEFICIENCY':
              case 'SIDING_EXTERIOR_DEFICIENCY':
              case 'FASCIA_EXTERIOR_DEFICIENCY':
              case 'WINDOWS_EXTERIOR_DEFICIENCY':
              case 'DOORS_EXTERIOR_DEFICIENCY':
              case 'GUTTERS_DOWNSPOUTS_EXTERIOR_DEFICIENCY':
              case 'EAVES_EXTERIOR_DEFICIENCY':
              case 'CHIMNEY_EXTERIOR_DEFICIENCY':
              case 'PORCH_EXTERIOR_DEFICIENCY':
              case 'PATIO_EXTERIOR_DEFICIENCY':
              case 'DECK_EXTERIOR_DEFICIENCY':
              case 'BALCONY_EXTERIOR_DEFICIENCY':
              case 'ENTRY_STAIRS_EXTERIOR_DEFICIENCY':
              case 'CARPORT_EXTERIOR_DEFICIENCY':
              case 'DRIVEWAY_EXTERIOR_DEFICIENCY':
              case 'INCOMPLETE_LANDSCAPING_EXTERIOR_DEFICIENCY':
              case 'EXTERIOR_WALLS_EXTERIOR_DEFICIENCY':
                report.description = `Image to capture each exterior deficiency identified. Ensure enough images are captured to show the location and extent of the damage. Image type name varies depending on the name of the deficient component selected.`;
                report.note = '';
                report.image_name = 'Image of exterior deficiency';
                break;

              case 'PLUMBING_MECHANICAL_DEFICIENCY':
              case 'ELECTRICAL_MECHANICAL_DEFICIENCY':
              case 'HEATING_MECHANICAL_DEFICIENCY':
              case 'WATER_HEATER_MECHANICAL_DEFICIENCY':
              case 'COOLING_MECHANICAL_DEFICIENCY':
              case 'SUMP_PUMP_MECHANICAL_DEFICIENCY':
                report.description = `Image to capture each mechanical deficiency identified. Ensure enough images are captured to show the location and extent of the damage.          
          Image type name varies depending upon the name of the deficient component.`;
                report.note = '';
                report.image_name = 'Image of mechanical deficiency';
                break;

              case 'PLUMBING_MECHANICAL_UPDATE':
              case 'ELECTRICAL_MECHANICAL_UPDATE':
              case 'HEATING_MECHANICAL_UPDATE':
              case 'WATER_HEATER_MECHANICAL_UPDATE':
              case 'COOLING_MECHANICAL_UPDATE':
              case 'SUMP_PUMP_MECHANICAL_UPDATE':
                report.description = `Image to capture each mechanical update identified. Ensure enough images are captured to show the location and extent of the update. Image type name varies depending upon the name of the update component.`;
                report.note = '';
                report.image_name = 'Image of mechanical update';
                break;

              case 'COUNTRYSIDE':
                report.description = 'Image of described view';
                report.note = '';
                report.image_name = 'Image of notable view';
                break;

              case 'TOOL_SHED':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.). For items such as graywater systems that are not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'WRAP_AROUND_PORCH':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.). For items such as graywater systems that are not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'OUTDOOR_KITCHEN':
                report.description =
                  'Images of the kitchen. At a minimum, images should be captured from two opposite corners in the room and provide floor to ceiling coverage.';
                report.note = '';
                report.image_name = 'Image of kitchen';
                break;

              case 'CARPORT':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.).  For items such as a graywater systems that not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'PATIO':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.).  For items such as a graywater systems that not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'STOOP':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.).  For items such as a graywater systems that not visible, provide images of control systems or the general area where the system is locate';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'FENCE':
                report.description =
                  'Image of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.).  For items such as a graywater systems that not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image of property improvements';
                break;

              case 'INTERSTATE':
                report.description = 'Image of described view';
                report.note = '';
                report.image_name = 'Image of notable view';
                break;

              case 'SIGNIFICANT_JUNK_TRASH':
                report.description =
                  'Image(s) evidencing adverse factor identified (e.g. sinkhole, failing structure, etc.)';
                report.note =
                  'This image should only be populated in cases where an adverse condition has been identified. If a condition exists that is not visible, such as an odor, capture the image of the general area suspected as the source of the condition.';
                report.image_name = 'Image of adverse conditions';
                break;

              case 'GREENHOUSE':
                report.description =
                  'Image(s) of each site improvement identified (e.g. swimming pool, hot tub, outdoor kitchen, etc.).  For items such as a graywater systems that not visible, provide images of control systems or the general area where the system is located.';
                report.note =
                  'This image should only be populated in cases where site improvements have been identified in the data.';
                report.image_name = 'Image(s) of property improvements';
                break;

              default:
                // report.image_name = report.photoType;
                break;
            }
          });
        });
        return report;
      });
      setPropertyImages(propertyImageData ?? []);
    };

    fetchReportData();
  }, [getCurrentReport]);

  const handleUploadReportImage = async () => {
    if (!selectedImage) {
      notify({
        title: 'Error',
        text: 'Please select image.',
        type: 'error',
      });
      return;
    }
    setLoading(true);
    if (metadata) {
      const { data, error } = await createPropertyImageFromReserve(selectedImage, metadata);
      if (data) {
        const dataWithUrl: Photo[] = propertyImages.map((image: Photo) => {
          if (
            data.image_type === image.photoType &&
            data.image_group === image.parentObjectJsonPath
          ) {
            return {
              ...image,
              url: data.url,
              imageName: data.image_name,
              fnm_status: FNM_IMAGE_STATUS.META_VERIFIED,
              uploaded_metadata: data.uploaded_metadata,
            };
          } else {
            return { ...image };
          }
        });

        setPropertyImages(dataWithUrl);
      }
      if (error) {
        setLoading(false);
        notify({
          title: 'Error',
          text: 'Something went wrong',
          type: 'error',
        });
        return error;
      }
      setSelectedImage(undefined);
      setOpen(false);
      setLoading(false);

      return data;
    }
  };

  const handleReportImageDelete = async (image: Photo) => {
    const { data, error } = await handleDeleteImage(image);
    if (error) {
      notify({
        title: 'Error',
        text: 'Something went wrong',
        type: 'error',
      });
      return;
    }
    if (data && data.length) {
      const deleteImageData = propertyImages.map((propertyImage: Photo) => {
        if (data[0].name === propertyImage.imageName) {
          return { ...propertyImage, imageName: '', url: '' };
        } else {
          return propertyImage;
        }
      });
      setPropertyImages(deleteImageData);
    }
  };

  const handleUploadImages = async () => {
    setLoading(true);

    const imagesArray = propertyImages.filter(
      (item) => item.url && item.url !== '' && item.fnm_status === FNM_IMAGE_STATUS.META_VERIFIED,
    );

    if (imagesArray.length) {
      const uploadPromises = imagesArray.map(async (image: Photo) => {
        const imageFormData = new FormData();
        imageFormData.append('uploadUrl', image.uploaded_metadata.uploadUrl);
        imageFormData.append('imageUrl', image.url!);

        try {
          const imageUploadResponse = await fetch('/api/upload-image', {
            method: 'POST',
            body: imageFormData,
          });

          const imageUploadResult = await imageUploadResponse.json();
          if (imageUploadResult.error) {
            return {
              status: 'rejected',
              reason:
                imageUploadResult.error[0].errorMessage ||
                'Something went wrong. Please try again later!',
              imageId: image.id!,
            };
          }

          if (imageUploadResult.success) {
            const supabaseResponse = await updatePropertyImageFnmStatus(
              image.id!,
              FNM_IMAGE_STATUS.FNM_ACCEPTED,
            );
            return { status: 'fulfilled', value: supabaseResponse, imageId: image.id! };
          } else {
            return {
              status: 'rejected',
              reason: imageUploadResult.error[0]
                ? imageUploadResult.error[0].errorMessage
                : imageUploadResult.error,
              imageId: image.id!,
            };
          }
        } catch (error: any) {
          return { status: 'rejected', reason: error.message, imageId: image.id! };
        }
      });

      const results = await Promise.allSettled(uploadPromises);

      setPropertyImages((prevPropertyImages: Photo[]) => {
        const updatedPropertyImages = [...prevPropertyImages];

        results.forEach((result: any) => {
          let imageId: string;
          if (result.status === 'fulfilled') {
            if (result.value.status === 'fulfilled') {
              imageId = result.value.imageId;
              const imageIndex = updatedPropertyImages.findIndex((image) => image.id === imageId);
              if (imageIndex !== -1) {
                updatedPropertyImages[imageIndex].fnm_status = FNM_IMAGE_STATUS.FNM_ACCEPTED;
                updatedPropertyImages[imageIndex].error = '';
              }
            } else if (result.value.status === 'rejected') {
              imageId = result.value.imageId;
              const imageIndex = updatedPropertyImages.findIndex((image) => image.id === imageId);
              if (imageIndex !== -1) {
                updatedPropertyImages[imageIndex].error =
                  result.value.reason || 'Something went wrong';
              }
            }
          } else if (result.status === 'rejected') {
            imageId = result.reason.imageId;
            const imageIndex = updatedPropertyImages.findIndex((image) => image.id === imageId);
            if (imageIndex !== -1) {
              updatedPropertyImages[imageIndex].error = result.value.reason;
            }
          }
        });

        return updatedPropertyImages;
      });

      const hasRejected = results.some(
        (result) =>
          result.status === 'rejected' ||
          (result.status === 'fulfilled' && result.value.status === 'rejected'),
      );

      if (!hasRejected) {
        notify({
          title: 'Success',
          text: 'Images submitted successfully.',
          type: 'success',
        });
      }

      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if any photo has uploaded_metadata and uploaded_metadata.photoId
    const hasUploadedMetadata = propertyImages.some(
      (photo) => photo.imageName && photo.uploaded_metadata && photo.uploaded_metadata.photoId,
    );
    // Update the state to disable the button if the condition is met
    setIsButtonDisabled(!hasUploadedMetadata);
  }, [propertyImages]);

  useEffect(() => {
    const getStatus = async () => {
      if (propertyImages.length && propertyImages[0].inspectionId) {
        let data = await getReportStatus(propertyImages[0].inspectionId);
        if (data.success) {
          if (data.data.status === 'COMPLETE') {
            setIsDeleteVisible(false);
            const { data, error } = await updateReportStatusByOrderId(id, 'COMPLETE');
            if (data) {
              return data;
            }
            return error;
          } else {
            setIsDeleteVisible(true);
          }
        }
      }
    };

    if (id) {
      getStatus();
    }
  }, [propertyImages, id]);

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-10">
      <SectionHeader
        title="Property Images"
        description="Prepare in advance an archive of images for the report"
      >
        <div className="flex w-64 items-center">
          <Button
            className="w-full space-x-2.5"
            onClick={handleUploadImages}
            disabled={loading || isButtonDisabled}
          >
            <Icon
              icon="double-check"
              size="sm"
            />
            <span>{loading ? 'Submitting...' : 'Submit Images'}</span>
          </Button>
        </div>
      </SectionHeader>
      <ImageUpload
        setOpen={setOpen}
        setMetadata={setMetadata}
        propertyImages={propertyImages}
        insertImageInBucket={insertImageInBucket}
        handleReportImageDelete={handleReportImageDelete}
        setPropertyImages={setPropertyImages}
        isDeleteVisible={isDeleteVisible}
      />
      {open && (
        <OrderImageSelectDialog
          handleUploadReportImage={handleUploadReportImage}
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          getImageOfOrder={getImageOfOrder}
          open={open}
          setOpen={setOpen}
          disabled={loading}
        />
      )}
    </div>
  );
};

export default PropertyImages;
