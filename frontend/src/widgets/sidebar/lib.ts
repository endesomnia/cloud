'use server'

import { redirect } from 'next/navigation'

export async function SideBarItemNavigate(route: string) {
  redirect(route)
}
