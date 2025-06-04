'use server'

import { signIn, signOut } from '@src/auth'
import { redirect } from 'next/navigation';

export async function DoLogin() {
  await signIn('github', { redirectTo: '/buckets' })
}

export async function DoLogout() {
  if (typeof window !== 'undefined') {
    localStorage.clear();
  }
  await signOut({ redirectTo: '/' });
  redirect('/');
}
