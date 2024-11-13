'use server';

import { jwtDecode, type JwtPayload } from 'jwt-decode';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import getUserId from './get-user-id';

interface JwtPayloadWithUserRole extends JwtPayload {
  user_role: string;
}

type TJwtPayloadWithUserRole = JwtPayloadWithUserRole | undefined | '';

const getUserRole = async (): Promise<IDbSeviceResponse<{ userRole: string | null }>> => {
  const userIdRes = await getUserId();
  const userId = userIdRes.data?.userId || null;

  if (!userId)
    return {
      data: {
        userRole: null,
      },
      error: userIdRes.error,
    };

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getSession();

  if (error)
    return {
      data: {
        userRole: null,
      },
      error: error,
    };

  const token = data.session?.access_token;
  const decodedToken: TJwtPayloadWithUserRole = token && jwtDecode(token);
  const userRole = (decodedToken && decodedToken.user_role) || null;

  return {
    data: {
      userRole,
    },
    error: null,
  };
};

export default getUserRole;
