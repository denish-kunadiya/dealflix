'use server';

import { UserResponse } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '@/utils/supabase/server';

const getUser = async (): Promise<UserResponse> => {
  const supabase = createSupabaseServerClient();

  const res = await supabase.auth.getUser();

  return res;
};

export default getUser;
