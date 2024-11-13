'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createSupabaseServerClient } from '@/utils/supabase/server';

export const signOut = async () => {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/login');
};
