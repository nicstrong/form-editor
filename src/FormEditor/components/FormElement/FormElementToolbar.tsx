import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

export function FormElementToolbar() {
  return (
    <div className='absolute top-full right-0 z-20 mr-8 flex -translate-y-1/4 items-center gap-2 rounded-md border border-gray-200 bg-white px-1 shadow-md'>
      <Button variant='ghost' size='icon' className='size-8'>
        <Trash2 className='text-red-500' />
      </Button>
    </div>
  )
}
