'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from './get-user-id';

const getOrders = async (filters?: any): Promise<IDbSeviceResponse<{ orders: any | null }>> => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { orders: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const res = await supabase
    .from('order')
    .select('*')
    .is('assignee_id', null)
    .eq('status', 'AVAILABLE');

  return {
    data: {
      orders: res.data || null,
    },
    error: res.error,
  };
};

export default getOrders;
