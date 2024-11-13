'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../get-user-id';

const storeImage = async (fileData: FormData, timeStamp: number, orderId: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;
  const file: any = fileData.get('file');
  if (!userId)
    return {
      data: { orders_images: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const fileExtension = file.name.split('.').pop();

  const { data, error } = await supabase.storage
    .from('order_property_image')
    .upload(`${orderId}/${userId}_${timeStamp}.${fileExtension}`, file);

  return {
    data: data || null,
    error,
  };
};

export default storeImage;
