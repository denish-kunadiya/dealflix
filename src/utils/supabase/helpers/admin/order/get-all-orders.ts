'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import getUserRole from '../../get-user-role';

export const allOrders = async () => {
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

  const { data, error } = await supabase.rpc('get_orders_with_history', {
    creator_id: userId,
  });
  return {
    data: data || [],
    error,
  };
};
