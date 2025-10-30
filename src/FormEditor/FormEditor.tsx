import { DndContext, DragOverlay } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { FormEditorSurface } from './components/FormEditorSurface'
import { Properties } from './components/Properties'
import { Toolbox } from './components/Toolbox'
import { FormElementDragOverlay } from './components/FormElement/FormElementDragOverlay'
import { setDebugMultiValue, setDebugValue } from '@/store/debugAtom'
import { createPortal } from 'react-dom'
import { useAtomValue } from 'jotai'
import { formAtom, updateElement } from '@/store/formStore'
import { useDragState } from './useDragState'

export default function FormEditor() {
  const [selectedElement, setSelectedElement] = useState<
    [number, string] | null
  >(null)

  const formRows = useAtomValue(formAtom)

  const {
    draggingElement,
    setRowResizing,
    resizeOverlay,
    onDragStart,
    onDragMove,
    onDragEnd,
  } = useDragState(formRows)

  useEffect(() => {
    setDebugMultiValue(
      'FormEditorRows',
      formRows.map((row) =>
        row.elements.map((el) => (el.colSpan ? el.colSpan : [null])),
      ),
    )
  }, [formRows])

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragMove={onDragMove}
    >
      <div className='bg-background flex h-screen'>
        <Toolbox />
        <div
          className='flex-1 overflow-y-auto p-6'
          onClick={() => setSelectedElement(null)}
        >
          <FormEditorSurface
            formRows={formRows}
            onElementSelected={(index, element) => {
              setSelectedElement([index, element.id])
            }}
            selectedElementId={selectedElement?.[1] ?? null}
            onRowResizing={(measurements) => {
              setRowResizing(measurements)
              setDebugValue('RowResizing', measurements)
            }}
          />
        </div>
        <Properties
          selectedElement={
            formRows
              .flatMap((row) => row.elements)
              .find((el) => el.id === selectedElement?.[1]) ?? null
          }
          updateElement={(updateFn) => {
            if (selectedElement) {
              updateElement(selectedElement[1], selectedElement[0], updateFn)
            }
          }}
        />
      </div>
      <DragOverlay>
        {draggingElement ? (
          <div className='flex items-center gap-2 rounded-md border-1 bg-white p-2'>
            <draggingElement.icon className='text-muted-foreground h-4 w-4' />
            <span className='text-sm font-medium'>{draggingElement.label}</span>
          </div>
        ) : resizeOverlay ? (
          createPortal(
            <FormElementDragOverlay {...resizeOverlay} />,
            document.body,
          )
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
