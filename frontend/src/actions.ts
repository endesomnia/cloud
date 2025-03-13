'use server'

import { signIn, signOut } from '@src/auth'

export async function DoLogin() {
  await signIn('github', { redirectTo: '/buckets' })
}

export async function DoLogout() {
  await signOut({ redirectTo: '/' })
}
