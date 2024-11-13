'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import { ORDER_STATUS } from '@/utils/constants';
import getUserRole from '../../get-user-role';

export const assignToPhotographer = async (orderId: string, assignTo: string) => {
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
    .update({
      status: ORDER_STATUS.ASSIGNED,
      assignee_id: assignTo,
    })
    .eq('id', orderId);

  return {
    data: data || [],
    error,
  };
};
