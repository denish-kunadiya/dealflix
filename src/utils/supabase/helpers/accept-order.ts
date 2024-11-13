'use server';

import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const accept = async (orderId: string) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const { data, error } = await supabase
    .from('order')
    .update({
      status: 'IN_PROGRESS',
      started_at: new Date(),
    })
    .eq('id', orderId);

  return {
    data: data || [],
    error,
  };
};