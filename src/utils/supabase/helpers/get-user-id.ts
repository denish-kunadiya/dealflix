'use server';

import getUser from './get-user';

const getUserId = async (): Promise<IDbSeviceResponse<{ userId: string | null }>> => {
  const {
    data: { user },
    error,
  } = await getUser();
  const userId = (user && user?.id) || null;

  if (!userId)
    return {
      data: { userId },
      error: {
        message: error?.message || 'Unauthorized',
      },
    };

  const res = {
    data: { userId },
    error: null,
  };

  return res;
};

export default getUserId;
