'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from './get-user-id';

const getReportById = async (id: string): Promise<IDbSeviceResponse<{ report: any | null }>> => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { report: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const res = await supabase.from('report').select('*').eq('id', id).eq('user_id', userId).single();

  return {
    data: {
      report: res.data || null,
    },
    error: res.error,
  };
};

export default getReportById;
