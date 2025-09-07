'use client'
import DashboardGrid from '@/components/DashboardGrid'
import { AddWidgetDialog } from '@/components/AddWidgetDialog'
import { SettingsDialog } from '@/components/SettingsDialog'
import { useDash } from '@/store/dashboard'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useToast } from '@/hooks/use-toast'

const Index = () => {
  const { widgets, exportJSON, importJSON, reset } = useDash()
  const { toast } = useToast()

  const handleExport = () => {
    const data = exportJSON()
    navigator.clipboard.writeText(data)
    toast({
      title: 'Config Exported',
      description: 'Dashboard configuration copied to clipboard',
    })
  }

  const handleImport = () => {
    const raw = prompt('Paste your dashboard configuration JSON:')
    if (raw) {
      try {
        importJSON(raw)
        toast({
          title: 'Config Imported',
          description: 'Dashboard configuration loaded successfully',
        })
      } catch (error) {
        toast({
          title: 'Import Failed',
          description: 'Invalid configuration format',
          variant: 'destructive',
        })
      }
    }
  }

  const handleReset = () => {
    if (confirm('Are you sure you want to reset the dashboard? This will remove all widgets.')) {
      reset()
      toast({
        title: 'Dashboard Reset',
        description: 'All widgets have been removed',
      })
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              📊
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                FinBoard
              </h1>
              <p className="text-sm text-muted-foreground">
                {widgets.length} active widget{widgets.length !== 1 ? 's' : ''} • Real-time data
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <AddWidgetDialog />
          <SettingsDialog />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-border">
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExport}>
                📤 Export Config
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleImport}>
                📥 Import Config  
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleReset} className="text-destructive">
                🗑️ Reset Dashboard
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Dashboard Grid */}
      <main className="relative">
        {widgets.length === 0 ? (
          <div className="h-96 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-4 text-4xl">
              📊
            </div>
            <h2 className="text-xl font-semibold mb-2">No widgets yet</h2>
            <p className="text-muted-foreground mb-4 max-w-md">
              Start building your custom finance dashboard by adding widgets that track real-time market data.
            </p>
            <AddWidgetDialog />
          </div>
        ) : (
          <DashboardGrid />
        )}
      </main>
    </div>
  )
}

export default Index
