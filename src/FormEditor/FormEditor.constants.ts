import {
  AlignLeft,
  CalendarIcon,
  CheckSquare,
  Circle,
  Hash,
  List,
  Lock,
  Mail,
  MousePointer,
  Sliders,
  ToggleLeft,
  Type,
} from 'lucide-react'
import type { FormControlType } from './FormEditor.types'

export type FormElementTemplate = {
  type: FormControlType
  label: string
  icon: React.ComponentType<{ className?: string }>
}
export const formElementTemplates = [
  { type: 'text' as const, label: 'Text Input', icon: Type },
  {
    type: 'textarea' as const,
    label: 'Textarea',
    icon: AlignLeft,
  },
  { type: 'select' as const, label: 'Select', icon: List },
  {
    type: 'checkbox' as const,
    label: 'Checkbox',
    icon: CheckSquare,
  },
  {
    type: 'radio' as const,
    label: 'Radio Group',
    icon: Circle,
  },
  {
    type: 'switch' as const,
    label: 'Switch',
    icon: ToggleLeft,
  },
  { type: 'slider' as const, label: 'Slider', icon: Sliders },
  { type: 'number' as const, label: 'Number', icon: Hash },
  { type: 'email' as const, label: 'Email', icon: Mail },
  { type: 'password' as const, label: 'Password', icon: Lock },
  {
    type: 'date' as const,
    label: 'Date Picker',
    icon: CalendarIcon,
  },
  {
    type: 'button' as const,
    label: 'Button',
    icon: MousePointer,
  },
]

export const DragTargets = {
  emptyForm: 'empty-form-placeholder',
  formRow: 'form-row-placeholder',
  endRow: 'end-placeholder',
}
