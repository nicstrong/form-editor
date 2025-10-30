import { Card } from '@/components/ui/card'
import { useDroppable } from '@dnd-kit/core'
import clsx from 'clsx'
import { Plus } from 'lucide-react'
import { DragTargets } from '../FormEditor.constants'

export function EmptyFormPlaceholder() {
  const { setNodeRef, isOver } = useDroppable({
    id: DragTargets.emptyForm,
  })
  return (
    <Card
      className={clsx(
        'border-2 border-dashed p-12 text-center',
        isOver && 'border-primary bg-muted',
      )}
      ref={setNodeRef}
    >
      <div className='text-muted-foreground'>
        <Plus className='mx-auto mb-4 h-12 w-12 opacity-50' />
        <h3 className='mb-2 text-lg font-medium'>Start building your form</h3>
        <p className='text-sm'>
          Drag and drop form controls from the left panel to add them to your
          form
        </p>
      </div>
    </Card>
  )
}
