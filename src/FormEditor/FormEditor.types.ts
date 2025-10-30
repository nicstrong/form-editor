import type {
  FormElementTemplate,
  formElementTemplates,
} from './FormEditor.constants'

export type FormControlType = (typeof formElementTemplates)[number]['type']

export type FormElement = {
  id: string
  type: FormControlType
  label?: string
  placeholder?: string
  required?: boolean
  options?: string[]
  colSpan: [number, number] // [colStart, colEnd]
  resized: boolean
}

export type FormRow = {
  elements: FormElement[]
}

export type FormRowDroppableType = {
  rowIndex: number
}

export type DraggableEventData =
  | {
      type: 'resize'
      side: 'left' | 'right'
      elementId: string
      parentContainerRef: React.RefObject<HTMLDivElement | null>
      rowIndex: number
    }
  | {
      type: 'template'
      template: FormElementTemplate
    }

export type RowResizingMeasurements = {
  index: number
  left: number
  width: number
}
