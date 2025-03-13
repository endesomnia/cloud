'use server'

import { redirect } from 'next/navigation'

export async function GoToGitHub(userName: string) {
  redirect(`https://github.com/${userName}`)
}
