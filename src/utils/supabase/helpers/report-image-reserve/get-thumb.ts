'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../get-user-id';

const getThumbs = async (orderId?: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId) {
    return {
      data: null,
      error: userIdRes.error,
    };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.rpc('get_order_images', {
    p_order_id: orderId,
  });

  if (error) {
    return { data: null, error };
  }

  const imageUrlData: string[] = data.map(
    (image: { first_image_url: string }) => image.first_image_url,
  );

  const { data: imgUrls, error: urlError } = await supabase.storage
    .from('order_image')
    .createSignedUrls(imageUrlData, 60000); // TODO: Find a more suitable duration

  if (urlError || !imgUrls) {
    return { data: null, error: urlError || new Error('Failed to retrieve image URLs') };
  }

  const thumbnail = data.map((image: any, index: number) => ({
    ...image,
    first_image_url: imgUrls[index]?.signedUrl || null,
  }));

  return {
    data: thumbnail || [],
    error: null,
  };
};

export default getThumbs;
