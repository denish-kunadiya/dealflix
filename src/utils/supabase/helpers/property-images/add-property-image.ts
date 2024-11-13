'use server';
import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const addPropertyImage = async (imageData: IInsertPropertyImage) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { order_image: null },
      error: userIdRes.error,
    };

  const { data, error } = await supabase
    .from('order_property_images')
    .insert(imageData)
    .select()
    .single();
  return {
    data: data || null,
    error,
  };
};
