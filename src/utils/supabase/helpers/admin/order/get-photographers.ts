'use server';

import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from '../../get-user-id';
import getUserRole from '../../get-user-role';

export const photographers = async () => {
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
    .from('role')
    .select(
      `
    *,
    photographer: profile (
      email,
      first_name,
      last_name
    )
  `,
    )
    .eq('role', 'photographer');

  return {
    data: data || [],
    error,
  };
};
