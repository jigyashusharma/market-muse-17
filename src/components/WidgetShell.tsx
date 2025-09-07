import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WidgetShellProps {
  title: string
  toolbar?: ReactNode
  children: ReactNode
}

export function WidgetShell({ title, toolbar, children }: WidgetShellProps) {
  return (
    <div className={cn(
      "rounded-xl border border-border bg-card backdrop-blur-sm p-4 h-full",
      "flex flex-col shadow-sm hover:shadow-md transition-shadow duration-200"
    )}>
      <div className="flex items-center justify-between mb-3 min-h-[24px]">
        <h3 className="font-semibold text-card-foreground truncate pr-2">
          {title}
        </h3>
        {toolbar && (
          <div className="flex items-center gap-2 flex-shrink-0">
            {toolbar}
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  )
}