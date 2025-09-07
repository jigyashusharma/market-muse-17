'use client'
import GridLayout, { Layout } from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import { useDash } from '@/store/dashboard'
import { ChartWidget } from './widgets/ChartWidget'
import { TableWidget } from './widgets/TableWidget'
import { CardsWidget } from './widgets/CardsWidget'

export default function DashboardGrid() {
  const { widgets, reorder, remove } = useDash()

  const layout: Layout[] = widgets.map(w => ({
    i: w.id,
    x: w.layout.x,
    y: w.layout.y,
    w: w.layout.w,
    h: w.layout.h,
    minW: 3,
    minH: 4,
  }))

  const onLayoutChange = (newLayout: Layout[]) => {
    const updatedWidgets = widgets.map(w => {
      const layoutItem = newLayout.find(l => l.i === w.id)
      if (layoutItem) {
        return {
          ...w,
          layout: {
            x: layoutItem.x,
            y: layoutItem.y,
            w: layoutItem.w,
            h: layoutItem.h,
          },
        }
      }
      return w
    })
    reorder(updatedWidgets)
  }

  return (
    <div className="w-full">
      <GridLayout
        className="layout"
        cols={12}
        rowHeight={40}
        width={1200}
        layout={layout}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        resizeHandles={['se']}
        margin={[16, 16]}
      >
        {widgets.map(w => (
          <div key={w.id} className="overflow-hidden">
            {w.kind === 'chart' && <ChartWidget w={w} />}
            {w.kind === 'table' && <TableWidget w={w} />}
            {w.kind === 'cards' && (
              <CardsWidget w={w} onRemove={() => remove(w.id)} />
            )}
          </div>
        ))}
      </GridLayout>
    </div>
  )
}