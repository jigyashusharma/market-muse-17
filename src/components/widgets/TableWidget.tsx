'use client'
import { useEffect, useState } from 'react'
import { WidgetShell } from '../WidgetShell'
import { WidgetConfig } from '@/store/dashboard'
import { getMultipleQuotes, getDefaultSymbols, StockData } from '@/lib/apis'
import { cn } from '@/lib/utils'

interface TableWidgetProps {
  w: WidgetConfig
}

export function TableWidget({ w }: TableWidgetProps) {
  const [symbols] = useState<string[]>(getDefaultSymbols())
  const [data, setData] = useState<StockData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let timer: NodeJS.Timeout
    let mounted = true

    async function loadData() {
      if (!mounted) return
      
      try {
        const quotes = await getMultipleQuotes(symbols)
        if (mounted) {
          setData(quotes)
          setLoading(false)
        }
      } catch (error) {
        if (mounted) {
          console.error('Failed to load table data:', error)
          setLoading(false)
        }
      }
    }

    loadData()
    
    if (w.refreshSec > 0) {
      timer = setInterval(loadData, Math.max(5, w.refreshSec) * 1000)
    }

    return () => {
      mounted = false
      if (timer) clearInterval(timer)
    }
  }, [symbols, w.refreshSec])

  const filteredData = data.filter(stock =>
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toolbar = (
    <div className="flex items-center gap-2">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
        className="text-xs px-2 py-1 rounded border border-border bg-background/50 focus:outline-none focus:ring-1 focus:ring-primary w-24"
      />
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
      <div className="h-full overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              Loading market data...
            </div>
          </div>
        ) : (
          <div className="h-full overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card/90 backdrop-blur-sm border-b border-border">
                <tr className="text-left">
                  <th className="p-3 font-medium text-muted-foreground">Symbol</th>
                  <th className="p-3 font-medium text-muted-foreground text-right">Price</th>
                  <th className="p-3 font-medium text-muted-foreground text-right">Change</th>
                  <th className="p-3 font-medium text-muted-foreground text-right">%</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((stock) => (
                  <tr 
                    key={stock.symbol} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3">
                      <div className="font-medium text-card-foreground">
                        {stock.symbol}
                      </div>
                    </td>
                    <td className="p-3 text-right font-mono">
                      <div className="font-medium">
                        ${stock.price.toFixed(2)}
                      </div>
                    </td>
                    <td className={cn(
                      "p-3 text-right font-mono",
                      stock.change >= 0 ? "text-finance-success" : "text-finance-danger"
                    )}>
                      <div className="font-medium">
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                      </div>
                    </td>
                    <td className={cn(
                      "p-3 text-right font-mono",
                      stock.changePercent >= 0 ? "text-finance-success" : "text-finance-danger"
                    )}>
                      <div className="flex items-center justify-end gap-1">
                        <span className="font-medium">
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          stock.changePercent >= 0 ? "bg-finance-success" : "bg-finance-danger"
                        )} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </WidgetShell>
  )
}