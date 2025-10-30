import { useDraggable } from '@dnd-kit/core'
import clsx from 'clsx'

type Props = {
  side: 'left' | 'right'
  elementId?: string
  parentContainerRef?: React.RefObject<HTMLDivElement | null>
  rowIndex: number
}

export function ResizeAnchor({
  side,
  elementId,
  parentContainerRef,
  rowIndex,
}: Props) {
  const { setNodeRef, listeners, attributes } = useDraggable({
    id: `resize-${side}-${elementId}`,
    data: { type: 'resize', side, elementId, parentContainerRef, rowIndex },
  })

  const draggableProps =
    elementId && parentContainerRef
      ? { ref: setNodeRef, ...listeners, ...attributes }
      : {}

  return (
    <div
      {...draggableProps}
      className={clsx(
        'absolute top-1/2 z-10 h-1/3 w-2 -translate-y-1/2 cursor-ew-resize rounded border-1 border-blue-400 bg-white transition',
        side === 'left' ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2',
      )}
    />
  )
}
