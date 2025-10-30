import { Plus, Settings, Trash2 } from 'lucide-react'
import type { FormElement } from '../FormEditor.types'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import type { FormElementUpdateFn } from '@/store/formStore'

type Props = {
  selectedElement: FormElement | null
  updateElement: React.Dispatch<FormElementUpdateFn>
}
export function Properties({ selectedElement, updateElement }: Props) {
  return (
    <div className='bg-muted/30 w-80 overflow-y-auto border-l p-4'>
      {selectedElement ? (
        <div>
          <h3 className='mb-4 flex items-center gap-2 text-lg font-semibold'>
            <Settings className='h-4 w-4' />
            Element Properties ({selectedElement.type})
          </h3>
          <div className='space-y-4'>
            <div>
              <Label htmlFor='element-label' className='text-sm font-medium'>
                Label
              </Label>
              <Input
                id='element-label'
                value={selectedElement.label}
                onChange={(e) =>
                  updateElement((el) => {
                    el.label = e.target.value
                  })
                }
                className='mt-1'
              />
            </div>
            {selectedElement.type !== 'button' &&
              selectedElement.type !== 'checkbox' &&
              selectedElement.type !== 'switch' && (
                <div>
                  <Label
                    htmlFor='element-placeholder'
                    className='text-sm font-medium'
                  >
                    Placeholder
                  </Label>
                  <Input
                    id='element-placeholder'
                    value={selectedElement.placeholder || ''}
                    onChange={(e) =>
                      updateElement((prev) => {
                        prev.placeholder = e.target.value
                      })
                    }
                    className='mt-1'
                  />
                </div>
              )}
            <div className='flex items-center space-x-2'>
              <Switch
                id='element-required'
                checked={selectedElement.required}
                onCheckedChange={(checked) =>
                  updateElement((prev) => {
                    prev.required = !!checked
                  })
                }
              />
              <Label htmlFor='element-required' className='text-sm font-medium'>
                Required field
              </Label>
            </div>
            {(selectedElement.type === 'select' ||
              selectedElement.type === 'radio') && (
              <div>
                <Label className='text-sm font-medium'>Options</Label>
                <div className='mt-2 space-y-2'>
                  {selectedElement.options?.map((option, idx) => (
                    <div key={idx} className='flex gap-2'>
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [
                            ...(selectedElement.options || []),
                          ]
                          newOptions[idx] = e.target.value
                          updateElement((prev) => {
                            prev.options = newOptions
                          })
                        }}
                        className='flex-1'
                      />
                      <Button
                        variant='outline'
                        size='icon'
                        onClick={() => {
                          const newOptions =
                            selectedElement.options?.filter(
                              (_, i) => i !== idx,
                            ) || []
                          updateElement((prev) => {
                            prev.options = newOptions
                          })
                        }}
                        className='shrink-0'
                      >
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      const newOptions = [
                        ...(selectedElement.options || []),
                        `Option ${(selectedElement.options?.length || 0) + 1}`,
                      ]
                      updateElement((prev) => {
                        prev.options = newOptions
                      })
                    }}
                    className='w-full'
                  >
                    <Plus className='mr-1 h-3 w-3' />
                    Add Option
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='text-muted-foreground py-8 text-center'>
          <Settings className='mx-auto mb-4 h-12 w-12 opacity-50' />
          <h3 className='mb-2 text-lg font-medium'>No Element Selected</h3>
          <p className='text-sm'>
            Click on a form element to edit its properties
          </p>
        </div>
      )}
    </div>
  )
}
