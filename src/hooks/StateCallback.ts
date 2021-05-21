import { useCallback, useEffect, useRef, useState } from 'react'

export function useStateCallback<T>(initialState: T) {
  const [state, setState] = useState(initialState)
  const cbRef = useRef<((prevState: T) => void) | null>(null) // mutable ref to store current callback

  const setStateCallback = useCallback(
    (s: T | ((prev: T) => T), cb: (() => void) | null = null) => {
      cbRef.current = cb // store passed callback to ref
      setState(s)
    },
    []
  )

  useEffect(() => {
    // cb.current is `null` on initial render, so we only execute cb on state *updates*
    if (cbRef.current) {
      cbRef.current(state)
      cbRef.current = null // reset callback after execution
    }
  }, [state])

  return [state, setStateCallback]
}
