'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDash, WidgetKind } from '@/store/dashboard'
import { cn } from '@/lib/utils'

export function AddWidgetDialog() {
  const { add } = useDash()
  const [open, setOpen] = useState(false)
  const [widgetName, setWidgetName] = useState('')
  const [widgetType, setWidgetType] = useState<WidgetKind>('chart')
  const [symbol, setSymbol] = useState('AAPL')
  const [refreshInterval, setRefreshInterval] = useState('30')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    add({
      kind: widgetType,
      title: widgetName || `${widgetType} Widget`,
      source: {
        type: 'alpha',
        endpoint: 'TIME_SERIES_DAILY',
        symbol: symbol.toUpperCase(),
      },
      refreshSec: parseInt(refreshInterval) || 30,
    })

    // Reset form
    setWidgetName('')
    setSymbol('AAPL')
    setRefreshInterval('30')
    setOpen(false)
  }

  const widgetTypes = [
    { value: 'chart', label: 'Chart', icon: '📈', description: 'Price chart with trends' },
    { value: 'table', label: 'Table', icon: '📊', description: 'Market data table' },
    { value: 'cards', label: 'Cards', icon: '💼', description: 'Key metrics cards' },
  ] as const

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
          + Add Widget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Add New Widget</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="widgetName" className="text-sm font-medium">
              Widget Name
            </Label>
            <Input
              id="widgetName"
              value={widgetName}
              onChange={(e) => setWidgetName(e.target.value)}
              placeholder="e.g., Bitcoin Price Tracker"
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Widget Type</Label>
            <div className="grid grid-cols-3 gap-2">
              {widgetTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setWidgetType(type.value)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    "hover:bg-muted/50",
                    widgetType === type.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border"
                  )}
                >
                  <div className="text-lg mb-1">{type.icon}</div>
                  <div className="font-medium text-sm">{type.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {type.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol" className="text-sm font-medium">
              Symbol
            </Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="AAPL, MSFT, BTC, etc."
              className="bg-background/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="refreshInterval" className="text-sm font-medium">
              Refresh Interval (seconds)
            </Label>
            <Select value={refreshInterval} onValueChange={setRefreshInterval}>
              <SelectTrigger className="bg-background/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 seconds</SelectItem>
                <SelectItem value="30">30 seconds</SelectItem>
                <SelectItem value="60">1 minute</SelectItem>
                <SelectItem value="300">5 minutes</SelectItem>
                <SelectItem value="0">Manual only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Add Widget
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}