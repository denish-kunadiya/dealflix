'use server';
import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

// Refactor. It was not implemented as discussed (soft_deleted_at).
export const softDeleteOrder = async (orderId: string) => {
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
    .update({ is_deleted: true }) // TODO: Refactor. Check it. Is is_deleted exists?
    .eq('id', orderId);

  return {
    data: data || [],
    error,
  };
};
