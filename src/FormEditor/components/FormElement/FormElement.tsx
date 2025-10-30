import type { FormElement } from '../../FormEditor.types'
import { Label } from '@/components/ui/label'
import clsx from 'clsx'
import { renderers } from './renderers'
import { ResizeAnchor } from './ResizeAnchor'
import { FormElementToolbar } from './FormElementToolbar'
import { useRef } from 'react'

type Props = {
  element: FormElement
  onClick: (element: FormElement) => void
  isSelected: boolean
  isRowResizing: boolean
  gridSpan: [number, number] | null
  rowIndex: number
}

export function FormElement({
  element,
  onClick,
  isSelected,
  isRowResizing,
  gridSpan,
  rowIndex,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const Renderer = renderers[element.type]

  if (!Renderer) {
    console.error(`No renderer found for element type: ${element.type}`)
    return null
  }

  return (
    <div
      className={clsx(
        gridSpan === null && 'flex-1',
        'relative flex flex-col gap-2 rounded border border-transparent p-3',
        { '!border-blue-300': isSelected },
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick(element)
      }}
      style={
        gridSpan !== null
          ? { gridColumnStart: gridSpan[0], gridColumnEnd: gridSpan[1] }
          : {}
      }
      ref={containerRef}
    >
      {isSelected && (
        <>
          <ResizeAnchor
            side='left'
            elementId={element.id}
            parentContainerRef={containerRef}
            rowIndex={rowIndex}
          />
          <ResizeAnchor
            side='right'
            elementId={element.id}
            parentContainerRef={containerRef}
            rowIndex={rowIndex}
          />
          {!isRowResizing && <FormElementToolbar />}
        </>
      )}
      {hasLabel(element) && (
        <Label
          className={clsx(isRowResizing && 'text-gray-200')}
          htmlFor={element.id}
        >
          {element.label}
        </Label>
      )}
      <Renderer element={element} isResizing={isRowResizing} />
    </div>
  )
}

function hasLabel(element: FormElement): boolean {
  return element.type !== 'button'
}
