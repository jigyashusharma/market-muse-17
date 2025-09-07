import { useEffect, useState } from 'react'
import { WidgetShell } from '../WidgetShell'
import { WidgetConfig } from '@/store/dashboard'
import { cn } from '@/lib/utils'

interface CardsWidgetProps {
  w: WidgetConfig
  onRemove?: () => void
}

interface MetricCard {
  label: string
  value: string
  change: number
  icon: string
}

export function CardsWidget({ w, onRemove }: CardsWidgetProps) {
  const [metrics, setMetrics] = useState<MetricCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let mounted = true

    function generateMetrics(): MetricCard[] {
      return [
        {
          label: 'Portfolio Value',
          value: `$${(245780 + Math.random() * 10000 - 5000).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          change: (Math.random() - 0.5) * 10,
          icon: '💼'
        },
        {
          label: 'Day P&L',
          value: `$${(1245 + Math.random() * 1000 - 500).toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
          change: (Math.random() - 0.3) * 15,
          icon: '📈'
        },
        {
          label: 'Market Cap',
          value: `$${(2.4 + Math.random() * 0.2).toFixed(1)}T`,
          change: (Math.random() - 0.4) * 5,
          icon: '🏦'
        },
        {
          label: 'Active Positions',
          value: `${Math.floor(12 + Math.random() * 5)}`,
          change: Math.random() > 0.5 ? 1 : 0,
          icon: '📊'
        }
      ]
    }

    function updateMetrics() {
      if (!mounted) return
      setMetrics(generateMetrics())
      setLoading(false)
    }

    updateMetrics()
    
    if (w.refreshSec > 0) {
      timer = setInterval(updateMetrics, w.refreshSec * 1000)
    }

    return () => {
      mounted = false
      if (timer) clearInterval(timer)
    }
  }, [w.refreshSec])

  const toolbar = (
    <div className="flex items-center gap-2">
      {onRemove && (
        <button
          onClick={onRemove}
          className="text-xs text-destructive hover:text-destructive/80 transition-colors"
        >
          ×
        </button>
      )}
      <span className="drag-handle cursor-grab text-xs text-muted-foreground hover:text-primary transition-colors">
        ⋮⋮
      </span>
      {loading && (
        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
      )}
    </div>
  )

  return (
    <WidgetShell title={w.title} toolbar={toolbar}>
      <div className="h-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading metrics...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-full">
            {metrics.map((metric, index) => (
              <div
                key={index}
                className={cn(
                  "rounded-lg border border-border bg-gradient-card p-4",
                  "hover:shadow-card transition-all duration-200",
                  "flex flex-col justify-between"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-medium">
                    {metric.label}
                  </span>
                  <span className="text-lg">{metric.icon}</span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xl font-bold text-card-foreground">
                    {metric.value}
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    metric.change >= 0 ? "text-finance-success" : "text-finance-danger"
                  )}>
                    <span className={cn(
                      "inline-block w-0 h-0 border-l-[3px] border-r-[3px] border-l-transparent border-r-transparent",
                      metric.change >= 0 
                        ? "border-b-[4px] border-b-finance-success" 
                        : "border-t-[4px] border-t-finance-danger"
                    )} />
                    {metric.change >= 0 ? '+' : ''}{metric.change.toFixed(2)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </WidgetShell>
  )
}