'use server';

import { createSupabaseServerClient } from '../server';
import getUserId from './get-user-id';

export const getMyOrders = async (filter: OrderFilter) => {
  const supabase = createSupabaseServerClient();

  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const { searchVal, activeTab } = filter;
  const { data, error } = await supabase.rpc('get_filtered_orders', {
    p_assigned_id: userId,
    p_status: activeTab,
    p_search_val: searchVal,
  });

  return {
    data: data || [],
    error,
  };
};
