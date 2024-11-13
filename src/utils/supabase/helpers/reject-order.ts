'use server';
import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const reject = async (orderId: string) => {
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
    .update({ assignee_id: null, status: 'AVAILABLE' })
    .eq('id', orderId)
    .eq('assignee_id', userId);

  await supabase.from('report').delete().eq('order_id', orderId).eq('user_id', userId);

  return {
    data: data || [],
    error,
  };
};
