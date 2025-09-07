'use client'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useDash } from '@/store/dashboard'
import { useToast } from '@/hooks/use-toast'

export function SettingsDialog() {
  const { settings, setSettings } = useDash()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [alphaKey, setAlphaKey] = useState(settings.keys.alpha || '')
  const [finnhubKey, setFinnhubKey] = useState(settings.keys.finnhub || '')

  const handleSave = () => {
    setSettings({
      keys: {
        alpha: alphaKey,
        finnhub: finnhubKey,
      },
    })
    
    toast({
      title: 'Settings Saved',
      description: 'Your API keys have been updated',
    })
    
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          ⚙️ Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Dashboard Settings</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="api-keys" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          
          <TabsContent value="api-keys" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alphaKey" className="text-sm font-medium">
                  AlphaVantage API Key
                </Label>
                <Input
                  id="alphaKey"
                  type="password"
                  value={alphaKey}
                  onChange={(e) => setAlphaKey(e.target.value)}
                  placeholder="Enter your AlphaVantage API key"
                  className="bg-background/50 border-border font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Get your free API key from{' '}
                  <a 
                    href="https://www.alphavantage.co/support/#api-key" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    alphavantage.co
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="finnhubKey" className="text-sm font-medium">
                  Finnhub API Key
                </Label>
                <Input
                  id="finnhubKey"
                  type="password"
                  value={finnhubKey}
                  onChange={(e) => setFinnhubKey(e.target.value)}
                  placeholder="Enter your Finnhub API key"
                  className="bg-background/50 border-border font-mono text-xs"
                />
                <p className="text-xs text-muted-foreground">
                  Get your free API key from{' '}
                  <a 
                    href="https://finnhub.io/register" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    finnhub.io
                  </a>
                </p>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                <p className="font-medium mb-1">Note:</p>
                <p>
                  API keys are stored locally in your browser and are never sent to external servers. 
                  In demo mode, the app uses mock data when API keys are not provided.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold mb-2">FinBoard</h3>
                <p className="text-muted-foreground">
                  A customizable finance dashboard that lets you build your own real-time 
                  trading interface with drag-and-drop widgets, live market data, and 
                  persistent layouts.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Features</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Real-time market data from multiple sources</li>
                  <li>• Drag-and-drop widget layout</li>
                  <li>• Customizable refresh intervals</li>
                  <li>• Import/export dashboard configurations</li>
                  <li>• Local data persistence</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Recharts', 'React Grid Layout'].map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-muted rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-border"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}