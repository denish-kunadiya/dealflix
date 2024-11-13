'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from './get-user-id';

const getProfile = async (): Promise<IDbSeviceResponse<{ profile: any | null }>> => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: { profile: null },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();

  const res = await supabase.from('profile').select().eq('user_id', userId).single();

  return {
    data: {
      profile: res.data || null,
    },
    error: res.error,
  };
};

export default getProfile;
