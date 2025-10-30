import {
  formElementTemplates,
  type FormElementTemplate,
} from '../FormEditor.constants'
import { useDraggable } from '@dnd-kit/core'

export function Toolbox() {
  return (
    <div className='bg-muted/30 w-80 overflow-y-auto border-r p-4'>
      <div className='space-y-4'>
        <div>
          <h2 className='-4 mb-3 text-lg font-semibold'>Form Controls</h2>
          <div className='grid gap-2'>
            {formElementTemplates.map((template) => (
              <TemplateItem control={template} key={template.type} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

type TemplateItemProps = {
  control: FormElementTemplate
}

function TemplateItem({ control }: TemplateItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `template-${control.type}`,
    data: { type: 'template', template: { ...control } },
  })
  const Icon = control.icon

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`hover:bg-accent cursor-hand mr-4 ml-4 flex items-center gap-2 rounded-md border-1 bg-white p-2 transition-colors ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <Icon className='text-muted-foreground h-4 w-4' />
      <span className='cursor-pointer text-sm font-medium'>
        {control.label}
      </span>
    </div>
  )
}
