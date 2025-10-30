import { useLayoutEffect, useRef } from 'react'

export const useLastValueRef = <T>(value: T) => {
  const ref = useRef(value)
  ref.current = value
  return ref
}

export function useValueRef<T>(value: T): { readonly current: T } {
  const ref = useRef(value)

  useLayoutEffect(() => {
    ref.current = value
  })

  return ref
}
