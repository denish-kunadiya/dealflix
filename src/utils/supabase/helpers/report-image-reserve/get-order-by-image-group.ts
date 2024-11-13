'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../get-user-id';

interface IImage {
  id: string;
  order_id: string;
  user_id: string;
  image_group: string;
  image_type: string;
  image_name: string;
  created_at: string;
  description: string | null;
  is_other: boolean;
}

const getOrderImagesByGroup = async (orderId: string, imageGroup: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders_images: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('order_images')
    .select('*')
    .eq('user_id', userId)
    .eq('order_id', orderId)
    .eq('image_group', imageGroup)
    .order('id', { ascending: false });
  if (data) {
    const imageNames = data.map((image: IImage) => `${image.order_id}/${image.image_name}`);
    const { data: imgUrl, error: err } = await supabase.storage
      .from('order_image')
      .createSignedUrls(imageNames, 60000); // TODO: Find a more suitable duration

    const combinedData = data.map((image: IImage) => {
      const urlData =
        imgUrl && imgUrl.find((url) => url.path && url.path.endsWith(image.image_name));
      return {
        ...image,
        url: urlData ? urlData.signedUrl : null,
      };
    });
    return {
      data: combinedData,
      error: err,
    };
  }

  return {
    data: [],
    error,
  };
};

export default getOrderImagesByGroup;
