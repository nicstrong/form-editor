import { addNewElement, updateElement } from '@/store/formStore'
import { DragTargets, type FormElementTemplate } from './FormEditor.constants'
import type { FormRow, RowResizingMeasurements } from './FormEditor.types'
import type { DragEndEvent, DragMoveEvent, DragStartEvent } from '@dnd-kit/core'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isDraggableEventData } from './FormEditor.utils'
import type { FormElementDragOverlayProps } from './components/FormElement/FormElementDragOverlay'
import {
  createActivity,
  deleteDebugValue,
  type Activity,
} from '@/store/debugAtom'
import { useLastValueRef } from '@/utils/react'

interface ResizeOverlayContext extends FormElementDragOverlayProps {
  startWidth: number
  startLeft: number
}

export function useDragState(formRows: FormRow[]) {
  const [draggingElement, setDraggingElement] =
    useState<FormElementTemplate | null>(null)
  const [resizeOverlay, setResizeOverlay] =
    useState<ResizeOverlayContext | null>(null)
  const [rowResizing, setRowResizing] =
    useState<RowResizingMeasurements | null>(null)

  const constRefs = useLastValueRef({
    gridMeasurements: rowResizing,
    formRowsLength: formRows.length,
    resizeOverlay,
  })

  const dragActivityRef = useRef<Activity | null>(null)

  useEffect(() => {}, [resizeOverlay])

  const onDragStart = useCallback((dragStart: DragStartEvent) => {
    console.log('FormEditor: handleDragStart', dragStart)

    dragActivityRef.current = createActivity('Drag operation')
    if (!isDraggableEventData(dragStart.active.data.current)) {
      console.error(
        'FormEditor: handleDragStart - not DraggableEventData. This probably means a useDraggable hook is not set up correctly.',
        dragStart,
      )
      return
    }
    const event = dragStart.active.data.current
    if (event.type === 'template') {
      console.log('FormEditor: handleDragStart - template', event.template)
      setDraggingElement(event.template)
    } else if (event.type === 'resize') {
      console.log('FormEditor: handleDragStart - resize', event)

      if (event.parentContainerRef.current) {
        const rect = event.parentContainerRef.current.getBoundingClientRect()
        setResizeOverlay({
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          side: event.side,
          startWidth: rect.width,
          startLeft: rect.left,
        })
      }
    } else {
      console.error('FormEditor: handleDragStart - unknown event type', event)
    }
  }, [])

  const onDragMove = useCallback(
    (dragMove: DragMoveEvent) => {
      dragActivityRef.current?.setDebugValue('FormElementDragOverlay', {
        ...constRefs.current.resizeOverlay,
      })

      const { gridMeasurements } = constRefs.current
      if (!isDraggableEventData(dragMove.active.data.current)) {
        console.error(
          'FormEditor: handleDragMove - not DraggableEventData. This probably means a useDraggable hook is not set up correctly.',
          dragMove,
        )
        return
      }
      const event = dragMove.active.data.current
      if (event.type === 'resize' && gridMeasurements) {
        const deltaX = dragMove.delta.x

        const maxWidth = gridMeasurements.width
        const minLeft = gridMeasurements.left + 40
        const maxLeft = gridMeasurements.left + gridMeasurements.width - 40 // 40px is the minimum width of the resize handle

        dragActivityRef.current?.setDebugValue('deltaX', deltaX)
        dragActivityRef.current?.setDebugValue('maxBounds', {
          maxWidth,
          minLeft,
          maxLeft,
        })

        setResizeOverlay((prev) => {
          if (!prev) return prev
          dragActivityRef.current?.setDebugValue('startLeft', prev.startLeft)
          if (prev.side === 'right') {
            return {
              ...prev,
              width: Math.max(40, Math.min(maxWidth, prev.startWidth + deltaX)),
            }
          } else if (prev.side === 'left') {
            return {
              ...prev,
              width: Math.max(40, prev.startWidth - deltaX),
              left: Math.min(maxLeft, prev.startLeft + deltaX),
            }
          }
          return prev
        })
      }
    },
    [constRefs],
  )

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setDraggingElement(null)
      setResizeOverlay(null)
      setRowResizing(null)

      deleteDebugValue('FormElementDragOverlayActual')
      deleteDebugValue('RowResizing')
      dragActivityRef.current?.dispose()

      const { formRowsLength } = constRefs.current

      if (!event.over) {
        return
      }
      const { over } = event
      if (!isDraggableEventData(event.active.data.current)) {
        console.error(
          'FormEditor: handleDragEnd - not DraggableEventData. This probably means a useDraggable hook is not set up correctly.',
          event,
        )
        return
      }
      const data = event.active.data.current

      console.log('FormEditor: handleDragEnd', data)

      if (data.type === 'template') {
        let rowIndex = -1
        if (over.id === DragTargets.endRow) {
          rowIndex = formRowsLength
        } else if (
          typeof over.id === 'string' &&
          over.id.startsWith(DragTargets.formRow)
        ) {
          rowIndex = over.data.current?.rowIndex
        } else if (over.id === DragTargets.emptyForm) {
          rowIndex = -1
        }

        addNewElement(rowIndex, data.template)
      } else if (
        data.type === 'resize' &&
        typeof over.id === 'string' &&
        over.id.startsWith('resize-col')
      ) {
        const colIndex = over.data.current?.colIndex
        if (colIndex !== undefined) {
          if (data.side === 'right') {
            updateElement(data.elementId, data.rowIndex, (prev) => {
              prev.colSpan = [prev.colSpan![0], colIndex + 2]
              prev.resized = true
            })
          } else if (data.side === 'left') {
            updateElement(data.elementId, data.rowIndex, (prev) => {
              prev.colSpan = [colIndex + 1, prev.colSpan![1]]
              prev.resized = true
            })
          }
        }
      }
    },
    [constRefs],
  )

  return {
    onDragStart,
    onDragMove,
    onDragEnd,
    draggingElement,
    setRowResizing,
    resizeOverlay,
  }
}
