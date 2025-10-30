import { useEffect, useRef } from 'react'
import { ResizeAnchor } from './ResizeAnchor'
import { setDebugValue } from '@/store/debugAtom'

export type FormElementDragOverlayProps = {
  width: number
  height: number
  top: number
  left: number
  side: 'left' | 'right'
}

export function FormElementDragOverlay({
  width,
  height,
  top,
  left,
  side,
}: FormElementDragOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (overlayRef.current) {
      const rect = overlayRef.current.getBoundingClientRect()
      setDebugValue('FormElementDragOverlayActual', {
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      })
    }
  }, [height, left, side, top, width])

  return (
    <div
      className='pointer-events-none fixed z-50 rounded border border-red-400'
      style={{
        width,
        height,
        top,
        left,
      }}
      ref={overlayRef}
    >
      <ResizeAnchor side='left' rowIndex={0} />
      <ResizeAnchor side='right' rowIndex={0} />
    </div>
  )
}
