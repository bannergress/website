import { handlePromise } from '../utils/async'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch } from '../../store'
import { RootState } from '../../storeTypes'
import { CACHE_BANNERS } from './actionTypes'
import { getBannerList } from './api'
import { BannerFilter } from './filter'
import { Banner } from './types'

const DEFAULT_PAGE_SIZE = 20

const usePrevious = function <T>(value: T) {
  const ref = useRef<T | undefined>(undefined)
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
  offset: number,
  state: State,
  setState: (s: State) => void,
  isRunning: () => boolean,
  cacheBanners: (banners: Banner[]) => void
) => {
  let currentState = { ...state }
  if (
    currentState.loadedPages < maxPages &&
    currentState.hasMore &&
    currentState.status === 'pending'
  ) {
    try {
      const page = currentState.loadedPages
      const result = await getBannerList(filter, offset, pageSize)
      if (isRunning()) {
        if (result.ok) {
          cacheBanners(result.data)
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
          currentState = { ...currentState, status: 'rejected' }
          setState(currentState)
        }
      }
    } catch {
      if (isRunning()) {
        currentState = { ...currentState, status: 'rejected' }
        setState(currentState)
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
  const dispatch = useDispatch<AppDispatch>()
  const cachedBanners = useSelector((state: RootState) => state.banner.banners)
  const [state, setState] = useState<State>(createInitialState(maxPages))
  const previousFilter = usePrevious(filter)
  const byId = new Map(cachedBanners.map((banner) => [banner.id, banner]))
  const listTypes = filter.listTypes
  const data = state.data
    .map((banner) => byId.get(banner.id) ?? banner)
    .filter(
      (banner) => !listTypes || listTypes.includes(banner.listType ?? 'none')
    )
  // Moving a banner out of a filtered list shifts the server's next page.
  // Count remaining entries instead of using the original page offset.
  const offset = data.length
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
      handlePromise(
        loadMissingPage(
          filter,
          maxPages,
          pageSize,
          offset,
          newState,
          setState,
          () => running,
          (banners) => dispatch({ type: CACHE_BANNERS, payload: banners })
        )
      )
    }
    return () => {
      running = false
    }
  }, [
    previousFilter,
    filter,
    maxPages,
    state,
    setState,
    pageSize,
    dispatch,
    offset,
  ])
  return {
    ...state,
    data,
  }
}
