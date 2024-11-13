'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../get-user-id';

const deleteImage = async (imageInfo: IImageDelete) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders_images: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const { error } = await supabase.storage
    .from('order_image')
    .remove([`${imageInfo.order_id}/${imageInfo.api_image_name}`]);

  if (error) {
    return {
      data: null,
      error,
    };
  }
  const { data: deleteFromTable, error: deleteError } = await supabase
    .from('order_images')
    .delete()
    .eq('id', imageInfo.id);

  return {
    data: deleteFromTable || null,
    deleteError,
  };
};

export default deleteImage;
