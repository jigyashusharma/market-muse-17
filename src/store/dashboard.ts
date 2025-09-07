import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'

export type WidgetKind = 'chart' | 'table' | 'cards'
export type SourceKind = 'alpha' | 'finnhub' | 'custom'

export type WidgetConfig = {
  id: string
  kind: WidgetKind
  title: string
  source: { 
    type: SourceKind
    endpoint: string
    symbol?: string
    params?: Record<string, string>
  }
  mapper?: { fields: string[] } // JSON paths selected via picker
  layout: { x: number; y: number; w: number; h: number }
  refreshSec: number
}

export type Settings = {
  theme: 'light' | 'dark'
  keys: { alpha?: string; finnhub?: string }
}

type State = {
  widgets: WidgetConfig[]
  settings: Settings
}

type Actions = {
  add: (partial?: Partial<WidgetConfig>) => void
  remove: (id: string) => void
  update: (id: string, patch: Partial<WidgetConfig>) => void
  reorder: (items: WidgetConfig[]) => void
  setSettings: (s: Partial<Settings>) => void
  reset: () => void
  exportJSON: () => string
  importJSON: (raw: string) => void
}

function defaultWidget(kind: WidgetKind): WidgetConfig {
  return {
    id: nanoid(),
    kind,
    title: kind === 'chart' ? 'Price Chart' : kind === 'table' ? 'Stocks Table' : 'Finance Cards',
    source: { type: 'alpha', endpoint: 'TIME_SERIES_DAILY', symbol: 'AAPL' },
    mapper: { fields: [] },
    layout: { x: 0, y: Infinity, w: 4, h: 6 },
    refreshSec: 30,
  }
}

export const useDash = create<State & Actions>()(
  persist(
    immer((set, get) => ({
      widgets: [
        defaultWidget('chart'),
        { ...defaultWidget('table'), layout: { x: 4, y: 0, w: 8, h: 6 } },
        { ...defaultWidget('cards'), layout: { x: 0, y: 6, w: 6, h: 4 } }
      ],
      settings: { theme: 'dark', keys: {} },

      add: (partial) =>
        set((state) => {
          state.widgets.push({
            ...defaultWidget(partial?.kind ?? 'cards'),
            ...partial,
            id: nanoid(),
          })
        }),

      remove: (id) =>
        set((state) => {
          state.widgets = state.widgets.filter((w) => w.id !== id)
        }),

      update: (id, patch) =>
        set((state) => {
          const w = state.widgets.find((w) => w.id === id)
          if (w) Object.assign(w, patch)
        }),

      reorder: (items) => set((state) => { state.widgets = items }),

      setSettings: (p) =>
        set((state) => {
          state.settings = {
            ...state.settings,
            ...p,
            keys: { ...state.settings.keys, ...(p as any).keys },
          }
        }),

      reset: () =>
        set((state) => {
          state.widgets = []
          state.settings = { theme: 'dark', keys: {} }
        }),

      exportJSON: () =>
        JSON.stringify(
          { widgets: get().widgets, settings: get().settings },
          null,
          2
        ),

      importJSON: (raw) => {
        try {
          const data = JSON.parse(raw)
          set((state) => {
            state.widgets = data.widgets || []
            state.settings = data.settings || { theme: 'dark', keys: {} }
          })
        } catch (error) {
          console.error('Failed to import JSON:', error)
        }
      },
    })),
    { name: 'finboard:v1' }
  )
)