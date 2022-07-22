import { useEffect, useRef, useState } from 'react'
import { getBannerList } from './api'
import { BannerFilter } from './filter'
import { Banner } from './types'

const DEFAULT_PAGE_SIZE = 20

const usePrevious = function <T>(value: T) {
  const ref = useRef<T>()
  useEffect(() => {
    ref.current = value
  }, [value])
  return ref.current
}

interface State {
  status: 'pending' | 'resolved' | 'rejected'
  data: Banner[]
  loadedPages: number
  hasMore: boolean
}

const loadMissingPage = async (
  filter: BannerFilter,
  maxPages: number,
  pageSize: number,
  state: State,
  setState: (s: State) => void,
  isRunning: () => boolean
) => {
  let currentState = { ...state }
  if (
    currentState.loadedPages < maxPages &&
    currentState.hasMore &&
    currentState.status === 'pending'
  ) {
    try {
      const page = currentState.loadedPages
      const result = await getBannerList(filter, page * pageSize, pageSize)
      if (isRunning()) {
        if (result.ok) {
          const hasMore = result.data.length === pageSize
          currentState = {
            status:
              hasMore && currentState.loadedPages < page
                ? 'pending'
                : 'resolved',
            data: [...currentState.data, ...result.data],
            loadedPages: page + 1,
            hasMore,
          }
          setState(currentState)
        } else {
          throw new Error()
        }
      }
    } catch (e) {
      if (isRunning()) {
        currentState = { ...currentState, status: 'rejected' }
      }
    }
  }
}

const createInitialState = (maxPages: number) => {
  const result: State = {
    status: maxPages > 0 ? 'pending' : 'resolved',
    data: [],
    loadedPages: 0,
    hasMore: true,
  }
  return result
}

export const useBannerList = function (
  filter: BannerFilter,
  maxPages: number,
  pageSize: number = DEFAULT_PAGE_SIZE
) {
  const [state, setState] = useState<State>(createInitialState(maxPages))
  const previousFilter = usePrevious(filter)
  useEffect(() => {
    let running = true
    let newState = state
    if (previousFilter !== filter) {
      newState = createInitialState(maxPages)
      setState(newState)
    } else if (
      state.status === 'resolved' &&
      state.loadedPages < maxPages &&
      state.hasMore
    ) {
      newState = {
        ...newState,
        status: 'pending',
      }
      setState(newState)
    } else {
      loadMissingPage(
        filter,
        maxPages,
        pageSize,
        newState,
        setState,
        () => running
      )
    }
    return () => {
      running = false
    }
  }, [previousFilter, filter, maxPages, state, setState, pageSize])
  return state
}
