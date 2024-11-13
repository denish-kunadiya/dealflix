'use server';

import { FNM_IMAGE_STATUS } from '@/utils/constants';
import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const updatePropertyImageFnmStatus = async (id: string, status: string) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: null,
      error: userIdRes.error,
    };
  const { data, error } = await supabase
    .from('order_property_images')
    .update({ fnm_status: status })
    .eq('id', id);
  return {
    data: data || null,
    error,
  };
};

export const updateRecord = async (id: string, fileName: string, metadata: IMetaDataResponse) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: null,
      error: userIdRes.error,
    };
  const { data, error } = await supabase
    .from('order_property_images')
    .update({
      fnm_status: FNM_IMAGE_STATUS.META_VERIFIED,
      image_name: fileName,
      uploaded_metadata: metadata,
    })
    .eq('id', id)
    .select()
    .single();

  return {
    data: data || null,
    error,
  };
};
