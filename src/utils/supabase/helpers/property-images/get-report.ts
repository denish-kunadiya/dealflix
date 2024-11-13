import { cloneDeep } from 'lodash';
import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const getReportbyOrderId = async (orderId: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId) {
    return {
      data: { report: null },
      error: userIdRes.error,
    };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('report')
    .select('*')
    .eq('order_id', orderId)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return {
      data: null,
      error: error || 'Report data not found',
    };
  }

  const updatedData = cloneDeep(data);

  if (!updatedData.fnm_required_photos || !Array.isArray(updatedData.fnm_required_photos)) {
    return {
      data: null,
      error: 'No fnm_required_photos found in the report data',
    };
  }

  /**
   * TODO: Refactor. I propose the following algorithm
   * 1. Request all images for the corresponding orderId and userId
   * 2. Filter the resulting image array according to the required image_type and image_group
   * 3. Make 1 request to the file storage using createSignedUrls
   * 4. Add the received data to your array of images
   */
  updatedData.fnm_required_photos = await Promise.all(
    updatedData.fnm_required_photos.map(async (report: Photo) => {
      const { data: imageData, error: imageError } = await supabase
        .from('order_property_images')
        .select('*')
        .eq('order_id', orderId)
        .eq('user_id', userId)
        .eq('image_type', report.photoType)
        .eq('image_group', report.parentObjectJsonPath)
        .single();

      if (imageError || !imageData) {
        return report; // No image data found, return report as is
      }

      const { data: urlData, error: urlError } = await supabase.storage
        .from('order_property_image')
        .createSignedUrl(imageData.image_name, 60);

      if (urlError || !urlData) {
        return {
          ...report,
          imageName: imageData.image_name,
          fnm_status: imageData.fnm_status,
          ...imageData,
        }; // Return report without URL if URL creation failed
      }

      return {
        ...report,
        url: urlData.signedUrl,
        imageName: imageData.image_name,
        fnm_status: imageData.fnm_status,
        ...imageData,
      };
    }),
  );

  return {
    data: updatedData,
    error: null,
  };
};
