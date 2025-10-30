// DebugOverlay.jsx
import { useAtom } from 'jotai'
import { createPortal } from 'react-dom'
import {
  debugOverlayMinimizedAtom,
  useDebugValues,
} from '../store/debugAtom'
import { Button } from '@/components/ui/button' // Adjust path as needed
import { ChevronDown, ChevronUp } from 'lucide-react'

export function DebugOverlay() {
  const debugValues = useDebugValues()
  const [minimized, setMinimized] = useAtom(debugOverlayMinimizedAtom)

  return createPortal(
    minimized ? (
      <div className='right-4bottom-4 pointer-events-auto fixed z-[9999] flex max-w-md items-center gap-2 rounded-lg bg-blue-600/50 p-3 text-xs text-white'>
        <span className='max-w-[300px] truncate'>Debug</span>
        <Button
          size='icon'
          variant='ghost'
          className='h-6 w-6 text-white'
          onClick={() => setMinimized(false)}
        >
          <ChevronUp size={16} />
        </Button>{' '}
      </div>
    ) : (
      <div className='pointer-events-auto fixed right-4 bottom-4 z-[9999] w-96 max-w-md rounded-lg bg-blue-600/50 p-3 text-sm text-white'>
        <div className='mb-2 flex items-center justify-between'>
          <strong>Debug Overlay</strong>
          <Button
            size='icon'
            variant='ghost'
            className='h-6 w-6 text-white'
            onClick={() => setMinimized(true)}
          >
            <ChevronDown size={16} />
          </Button>
        </div>
        <pre className='break-all whitespace-pre-wrap'>
          {JSON.stringify(debugValues.defaultValues, null, 2)}
        </pre>
        {debugValues.activityValues &&
          Object.keys(debugValues.activityValues).map((activityId) => {
            const activityData = debugValues.activityValues[activityId]
            return (
              <>
                <h3 className='mb-2 text-lg font-semibold'>
                  {activityData.name}
                </h3>
                <pre className='break-all whitespace-pre-wrap'>
                  {JSON.stringify(activityData.data, null, 2)}
                </pre>
              </>
            )
          })}
      </div>
    ),
    document.body,
  )
}
