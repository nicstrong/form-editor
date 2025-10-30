import { Input } from '@/components/ui/input'
import type { FormElement } from '../../FormEditor.types'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { DatePicker } from './DatePicker'

export const renderers: Record<
  FormElement['type'],
  React.ComponentType<{ element: FormElement; isResizing: boolean }>
> = {
  text: ({ element, isResizing }) => (
    <Input
      id={element.id}
      type='text'
      placeholder={element.placeholder}
      required={element.required}
      disabled={isResizing}
    />
  ),
  textarea: ({ element }) => (
    <Textarea
      id={element.id}
      placeholder={element.placeholder}
      required={element.required}
      className='w-full rounded border p-2'
    />
  ),
  checkbox: ({ element }) => (
    <Checkbox id={element.id} required={element.required} />
  ),
  select: ({ element }) => (
    <Select>
      <SelectTrigger id={element.id} className='w-full'>
        <SelectValue placeholder={element.placeholder ?? 'Select a value'} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {element.options?.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
  radio: ({ element }) => (
    <RadioGroup>
      {element.options?.map((option) => (
        <div key={option} className='flex items-center gap-3'>
          <RadioGroupItem value={option} id={`radio-${option}`} />
          <Label htmlFor={`radio-${option}`}>{option}</Label>
        </div>
      ))}
    </RadioGroup>
  ),
  switch: ({ element }) => (
    <Switch id={element.id} required={element.required} />
  ),
  slider: () => <Slider defaultValue={[50]} max={100} step={1} />,
  number: ({ element }) => (
    <Input
      id={element.id}
      type='number'
      placeholder={element.placeholder}
      required={element.required}
    />
  ),
  email: ({ element }) => (
    <Input
      id={element.id}
      type='email'
      placeholder={element.placeholder}
      required={element.required}
    />
  ),
  password: ({ element }) => (
    <Input
      id={element.id}
      type='password'
      placeholder={element.placeholder}
      required={element.required}
    />
  ),
  date: () => <DatePicker />,
  button: ({ element }) => <Button>{element.label}</Button>,
}
