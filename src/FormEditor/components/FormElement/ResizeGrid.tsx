import type { RowResizingMeasurements } from '@/FormEditor/FormEditor.types'
import { useLastValueRef } from '@/utils/react'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { useEffect, useRef } from 'react'

type Props = {
  rowIndex: number
  columns: number
  onMount: (measurements: RowResizingMeasurements) => void
}

export function ResizeGrid({ columns, rowIndex, onMount }: Props) {
  const gridRef = useRef<HTMLDivElement>(null)

  const onMountRef = useLastValueRef(onMount)

  useEffect(() => {
    if (gridRef.current && onMountRef.current) {
      const rect = gridRef.current.getBoundingClientRect()
      onMountRef.current({
        index: rowIndex,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [onMountRef, rowIndex])

  return (
    <div ref={gridRef} className='absolute inset-0 z-20 flex'>
      {Array.from({ length: columns }).map((_, i) => {
        const colId = `resize-col-${i}`
        return <Column key={colId} colId={colId} colIndex={i} />
      })}
    </div>
  )
}

function Column({ colId, colIndex }: { colId: string; colIndex: number }) {
  const { setNodeRef, isOver } = useDroppable({ id: colId, data: { colIndex } })
  return (
    <div
      key={colId}
      ref={setNodeRef}
      className={clsx(
        'pointer-events-auto h-full flex-1 border-l border-dashed border-blue-200 last:border-r',
        isOver ? 'bg-blue-200/60' : 'bg-transparent',
      )}
    />
  )
}
