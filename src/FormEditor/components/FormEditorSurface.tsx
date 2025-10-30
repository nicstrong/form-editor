import type {
  FormRow as FormRowType,
  RowResizingMeasurements,
} from '../FormEditor.types'
import { EmptyFormPlaceholder } from './EmptyFormPlaceholder'
import { type FormElement as FormElementType } from '../FormEditor.types'
import { useDroppable, useDndContext } from '@dnd-kit/core'
import { DragTargets } from '../FormEditor.constants'
import { FormRow } from './FormRow'
import { isDraggableEventData } from '../FormEditor.utils'

type Props = {
  formRows: FormRowType[]
  onElementSelected: (rowIndex: number, element: FormElementType) => void
  selectedElementId: string | null
  onRowResizing: (measurements: RowResizingMeasurements) => void
}

export function FormEditorSurface({
  formRows,
  onElementSelected,
  selectedElementId,
  onRowResizing,
}: Props) {
  // Removed unused useDndMonitor code
  const { active } = useDndContext()
  const isTemplateDragging =
    !!active &&
    isDraggableEventData(active.data?.current) &&
    active.data.current.type === 'template'

  return (
    <>
      <div className='mx-auto max-w-4xl'>
        <div className='mb-6 flex items-center justify-between'>
          <h1 className='text-2xl font-bold'>Form Editor</h1>
        </div>
        {formRows.length === 0 ? (
          <EmptyFormPlaceholder />
        ) : (
          formRows.map((row, index) => (
            <FormRow
              key={index}
              index={index}
              row={row}
              onElementSelected={(el) => onElementSelected(index, el)}
              selectedElementId={selectedElementId}
              onRowResizing={onRowResizing}
            />
          ))
        )}
        {isTemplateDragging && formRows.length > 0 && <DropPlaceholder />}
      </div>
    </>
  )
}

function DropPlaceholder() {
  const { setNodeRef, isOver } = useDroppable({ id: DragTargets.endRow })
  return (
    <div
      ref={setNodeRef}
      className={`my-2 flex h-12 items-center justify-center rounded border-2 border-dashed border-blue-400 bg-blue-50 p-1 transition ${
        isOver ? 'bg-blue-200' : ''
      }`}
    >
      <span className='text-blue-500'>Drop here to add in a new row</span>
    </div>
  )
}
