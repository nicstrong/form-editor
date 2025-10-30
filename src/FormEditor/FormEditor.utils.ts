import type { DraggableEventData } from './FormEditor.types'

export function isDraggableEventData(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> | undefined,
): data is DraggableEventData {
  return (
    data !== undefined &&
    ((data as DraggableEventData).type === 'resize' ||
      (data as DraggableEventData).type === 'template')
  )
}
