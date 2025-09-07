import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { WidgetShell } from '../WidgetShell'
import { WidgetConfig } from '@/store/dashboard'
import { getAlphaDaily, ChartDataPoint } from '@/lib/apis'
import { cn } from '@/lib/utils'

interface ChartWidgetProps {
  w: WidgetConfig
}

export function ChartWidget({ w }: ChartWidgetProps) {
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout
    let mounted = true

    async function loadData() {
      if (!mounted) return
      
      try {
        setError(null)
        const json = await getAlphaDaily(w.source.symbol || 'AAPL')
        
        if (!mounted) return
        
        const series = json['Time Series (Daily)'] || {}
        const points = Object.entries(series)
          .map(([date, ohlc]: any) => ({
            date,
            close: parseFloat(ohlc['4. close']),
            volume: parseInt(ohlc['5. volume'])
          }))
          .reverse()
          .slice(-60) // Show last 60 days
        
        setData(points)
        setLoading(false)
      } catch (err) {
        if (mounted) {
          setError('Failed to load chart data')
          setLoading(false)
        }
      }
    }

    loadData()
    
    if (w.refreshSec > 0) {
      timer = setInterval(loadData, w.refreshSec * 1000)
    }

    return () => {
      mounted = false
      if (timer) clearInterval(timer)
    }
  }, [w.source.symbol, w.refreshSec])

  const latestPrice = data[data.length - 1]?.close
  const previousPrice = data[data.length - 2]?.close
  const priceChange = latestPrice && previousPrice ? latestPrice - previousPrice : 0
  const priceChangePercent = previousPrice ? (priceChange / previousPrice) * 100 : 0
  const isPositive = priceChange >= 0

  const toolbar = (
    <div className="flex items-center gap-2">
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
      <div className="h-full flex flex-col">
        {/* Price header */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground">
                {w.source.symbol || 'AAPL'}
              </div>
              <div className="text-2xl font-bold">
                ${latestPrice?.toFixed(2) || '--'}
              </div>
            </div>
            {latestPrice && (
              <div className={cn(
                "text-right",
                isPositive ? "text-finance-success" : "text-finance-danger"
              )}>
                <div className="text-sm font-medium">
                  {isPositive ? '+' : ''}{priceChange.toFixed(2)}
                </div>
                <div className="text-xs">
                  {isPositive ? '+' : ''}{priceChangePercent.toFixed(2)}%
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Loading chart data...
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex items-center justify-center text-destructive">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                  domain={['dataMin - 5', 'dataMax + 5']}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </WidgetShell>
  )
}