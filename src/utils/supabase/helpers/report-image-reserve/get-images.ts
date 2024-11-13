'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../get-user-id';

const getImages = async (orderId: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders_images: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const res = await supabase
    .from('order_images')
    .select('*')
    .eq('user_id', userId)
    .eq('order_id', orderId);

  return {
    data: {
      orders_images: res.data || [],
    },
    error: res.error,
  };
};

export default getImages;
