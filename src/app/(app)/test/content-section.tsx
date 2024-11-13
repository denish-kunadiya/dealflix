import { createSupabaseServerClient } from '@/utils/supabase/server';

import { SubmitButton } from '@/components/ui/submit-button';
// import { saveToken, getTokensData, refreshToken, refreshAndSetToken } from '@/utils/pda/fannie-mae';
import {
  createTokens,
  createAndSaveToken,
  refreshToken,
  refreshAndSetToken,
  calcTokensServiceData,
  getValidAccessToken,
} from '@/utils/pda/freddie-mac';
import getProfile from '@/utils/supabase/helpers/get-profile';

const ContentSection = async () => {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <section className="flex-col gap-4">
      <div className="py-5 text-xl text-gray-900">Hey, {user?.email}!</div>
      <form
        action="#"
        method="POST"
      >
        <SubmitButton
          formAction={getValidAccessToken}
          className="mb-5 flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          pendingText="Processing..."
        >
          test
        </SubmitButton>
      </form>
    </section>
  );
};

export default ContentSection;
