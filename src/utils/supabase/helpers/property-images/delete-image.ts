'use server';

import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const deleteImage = async (orderId: string, image: IDeleteImage) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { image: null },
      error: userIdRes.error,
    };
  // TODO: Refactor. Exclude code repeating
  if (image.imageName && !image.id) {
    const { data, error } = await supabase.storage
      .from('order_property_image')
      .remove([image.imageName]);
    if (error) {
      return {
        data: { image: null },
        error: 'Image not in bucket',
      };
    }
    await supabase
      .from('order_property_images')
      .delete()
      .eq('order_id', orderId)
      .eq('user_id', userId)
      .eq('image_type', image.photoType)
      .eq('image_name', image.imageName)
      .eq('image_group', image.parentObjectJsonPath);

    return {
      data,
      error,
    };
  } else if (image.imageName && image.id) {
    const { data, error } = await supabase.storage
      .from('order_property_image')
      .remove([image.imageName]);
    if (error) {
      return {
        data: { image: null },
        error: 'Image not in bucket',
      };
    }
    await supabase
      .from('order_property_images')
      .update({
        fnm_status: null,
        image_name: null,
      })
      .eq('id', image.id);

    return {
      data,
      error,
    };
  } else {
    return {
      data: { image: null },
      error: 'Image not found',
    };
  }
};
