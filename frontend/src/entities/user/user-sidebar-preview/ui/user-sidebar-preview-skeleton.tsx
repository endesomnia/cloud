'use client'

import { Skeleton } from '@shared/ui'

export const UserSideBarPreviewSkeleton = () => {
  return (
    <div className="flex items-center justify-between">
      <Skeleton className="w-8 h-8 mr-1 rounded-full" />
      <Skeleton className="h-8 w-28" />
    </div>
  )
}
