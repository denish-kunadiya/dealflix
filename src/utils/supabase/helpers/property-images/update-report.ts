import { createSupabaseServerClient } from '../../server';
import getUserId from '../get-user-id';

export const updateReportStatusByOrderId = async (orderId: string, status: string) => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { report: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from('report')
    .update({ fnm_inspection_status: status })
    .eq('order_id', orderId)
    .eq('user_id', userId)
    .single();

  return {
    data: data || null,
    error,
  };
};
