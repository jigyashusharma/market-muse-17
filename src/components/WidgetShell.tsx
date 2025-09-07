import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WidgetShellProps {
  title: string
  toolbar?: ReactNode
  children: ReactNode
  className?: string
}

export function WidgetShell({ title, toolbar, children, className }: WidgetShellProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/80 backdrop-blur-sm shadow-widget",
        "hover:shadow-glow transition-all duration-300",
        "h-full flex flex-col overflow-hidden",
        className
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <h3 className="font-semibold text-card-foreground truncate flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          {title}
        </h3>
        <div className="flex items-center gap-2 text-muted-foreground">
          {toolbar}
        </div>
      </div>
      <div className="flex-1 p-4 min-h-0 overflow-hidden">
        {children}
      </div>
    </div>
  )
}