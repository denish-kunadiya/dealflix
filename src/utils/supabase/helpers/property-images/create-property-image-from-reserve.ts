'use server';

import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const createPropertyImageFromReserve = async (
  orderId: string,
  imageName: string,
  fileName: string,
) => {
  const supabase = createSupabaseServerClient();

  // Get the user ID
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId) {
    return {
      data: { order_image: null },
      error: userIdRes.error,
    };
  }
  // TODO: Refactor. Looks like here we can use storage.copy function instead download and upload
  const { data: imageData, error: downloadError } = await supabase.storage
    .from('order_image')
    .download(`${orderId}/${imageName}`);
  if (downloadError) {
    return { error: downloadError };
  }

  await supabase.storage.from('order_property_image').upload(fileName, imageData);

  const { data: signedURL, error: signedUrlError } = await supabase.storage
    .from('order_property_image')
    .createSignedUrl(fileName, 60);

  return {
    data: signedURL || null,
    error: signedUrlError,
  };
};
