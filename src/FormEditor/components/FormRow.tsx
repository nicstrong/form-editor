import { useDroppable, useDndContext } from '@dnd-kit/core'
// Type guard for drag event data
function isDraggableEventData(data: unknown): data is { type: string } {
  return !!data && typeof (data as { type?: unknown }).type === 'string'
}
import { DragTargets } from '../FormEditor.constants'
import clsx from 'clsx'
import {
  type FormElement as FormElementType,
  type RowResizingMeasurements,
} from '../FormEditor.types'
import { type FormRow as FormRowType } from '../FormEditor.types'

// Weight is either null or 1-12 (bootstrap-style 12-col grid)
import { FormElement } from './FormElement/FormElement'
import { ResizeGrid } from './FormElement/ResizeGrid'

type Props = {
  row: FormRowType
  index: number
  onElementSelected: (element: FormElementType) => void
  selectedElementId: string | null
onRowResizing: (measurements: RowResizingMeasurements) => void
}

export function FormRow({
  row,
  index,
  onElementSelected,
  selectedElementId,
  onRowResizing,
}: Props) {
  const { setNodeRef, isOver } = useDroppable({
    id: `${DragTargets.formRow}-${index}`,
    data: { rowIndex: index },
  })
  const { active } = useDndContext()
  let isTemplateOver = false
  if (isOver && active && isDraggableEventData(active.data?.current)) {
    isTemplateOver = active.data.current.type === 'template'
  }
  const isResizing =
    active &&
    isDraggableEventData(active.data?.current) &&
    active.data.current.type === 'resize'

  const useGrid = row.elements.every((el) => el.colSpan !== undefined)

  return (
    <div
      ref={setNodeRef}
      className={clsx(
        'relative rounded border-2 border-dashed border-transparent',
        useGrid ? 'grid grid-cols-12 gap-2' : 'flex',
        isTemplateOver && '!border-blue-400',
      )}
    >
      {row.elements.map((element) => {
        return (
          <FormElement
            key={element.id}
            element={element}
            onClick={onElementSelected}
            isSelected={selectedElementId === element.id}
            isRowResizing={isResizing ?? false}
            rowIndex={index}
            gridSpan={useGrid ? element.colSpan! : null}
          />
        )
      })}
      {isResizing && (
        <ResizeGrid columns={12} rowIndex={index} onMount={onRowResizing} />
      )}
    </div>
  )
}
