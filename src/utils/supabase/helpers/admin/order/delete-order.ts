'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import getUserRole from '../../get-user-role';

export const deleteOrder = async (orderId: string) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;
  const {
    data: { userRole },
  } = await getUserRole();

  if (!userId && userRole !== 'admin')
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const { data, error } = await supabase.from('order').delete().eq('id', orderId).select().single();

  if (data) {
    const { error: orderImageError } = await supabase.storage.from('order_image').remove([data.id]);
    const { error: propertyImageError } = await supabase.storage
      .from('order_property_image')
      .remove([data.id]);
  }
  return {
    data: data || null,
    error,
  };
};
