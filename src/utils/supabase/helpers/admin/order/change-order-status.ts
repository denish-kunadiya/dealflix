'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import getUserRole from '../../get-user-role';

export const changeOrderStatus = async (
  orderId: string,
  status: string,
  assigneeId: string | null,
) => {
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

  const { data, error } = await supabase
    .from('order')
    .update({ assignee_id: assigneeId, status: status })
    .eq('id', orderId);

  return {
    data: data || [],
    error,
  };
};
