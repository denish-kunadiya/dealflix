'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from './get-user-id';

const getOrderById = async (id: string): Promise<IDbSeviceResponse<{ order: any | null }>> => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { order: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const res = await supabase
    .from('order')
    .select('*, report(*)')
    .eq('id', id)
    .eq('assignee_id', userId)
    .eq('report.user_id', userId)
    .single();

  return {
    data: {
      order: res.data || null,
    },
    error: res.error,
  };
};

export default getOrderById;
