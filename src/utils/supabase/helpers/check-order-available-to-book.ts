'use server';
import { ORDER_STATUS } from '@/utils/constants';
import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const checkOrderAvailableToBook = async (orderId: string) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };
  // TODO: Refactor. Check conditions. Looks like all neq conditions are not needed here.
  const { data, error } = await supabase
    .from('order')
    .select('*')
    .eq('id', orderId)
    .eq('status', ORDER_STATUS.AVAILABLE)
    .neq('status', ORDER_STATUS.IN_PROGRESS)
    .neq('status', ORDER_STATUS.COMPLETE)
    .neq('status', ORDER_STATUS.ASSIGNED)
    .order('created_at', { ascending: true })
    .maybeSingle();
  return {
    data: data && data.id ? true : false,
    error,
  };
};
