import * as React from 'react'
import { cn } from '../lib'

export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}


const Box = React.forwardRef<HTMLDivElement, BoxProps>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('bg-background text-foreground', className)} {...props} />
})

Box.displayName = 'Box'

export { Box }
