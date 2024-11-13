'use server';

import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const insert = async (
  file: any,
  orderId: string,
  imageReserve: TypesOfImages,
  imageGroup: string,
  timeStamp: number,
) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { order_image: null },
      error: userIdRes.error,
    };
  const fileExtension = file.name.split('.').pop();

  const submitData = {
    order_id: orderId,
    user_id: userId,
    image_group: imageGroup,
    image_type: imageReserve.image_type,
    is_other: imageReserve.is_other,
    image_name: `${userId}_${timeStamp}.${fileExtension}`,
  };

  const { data, error } = await supabase.from('order_images').insert(submitData).select();
  if (error) {
    return {
      data: null,
      error,
    };
  }

  const { data: storeImageBucket, error: storeImageBucketError } = await supabase.storage
    .from('order_image')
    .upload(`${orderId}/${userId}_${timeStamp}.${fileExtension}`, file);

  if (storeImageBucketError) {
    const { data: deleteImageData, error: deleteImageError } = await supabase
      .from('order_images')
      .delete()
      .eq('id', data?.[0].id);

    if (deleteImageError) {
      return {
        data: null,
        error: deleteImageError,
      };
    }
    return { data: null, error: null };
  }
  return {
    data: data || null,
    error,
  };
};
