'use server';

import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const updateDescription = async (description: string, imageId: string) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { order_images: null },
      error: userIdRes.error,
    };

  const { data, error } = await supabase
    .from('order_images')
    .update({ description })
    .eq('id', imageId);

  return {
    data: data || [],
    error,
  };
};
