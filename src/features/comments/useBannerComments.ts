import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getComment,
  getCommentCapabilities,
  getComments,
  getOwnComments,
  submitComment,
  withdrawComment,
} from './api'
import type { BannerComment, CommentCapabilities, CommentPage } from './types'

export const mergeComments = (
  current: BannerComment[],
  incoming: BannerComment[]
) => {
  const items = new Map(current.map((item) => [item.id, item]))
  incoming.forEach((item) => items.set(item.id, item))
  return [...items.values()].sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id)
  )
}

const emptyPage: CommentPage = { items: [], publishedCount: 0 }

// The caller keys this hook's component by banner and authenticated subject.
// Private responses and drafts must never survive an account change.
export function useBannerComments(
  bannerId: string,
  authenticated: boolean,
  initialized: boolean,
  targetId?: string
) {
  const [page, setPage] = useState<CommentPage>(emptyPage)
  const [ownPage, setOwnPage] = useState<CommentPage>(emptyPage)
  const [capabilities, setCapabilities] = useState<CommentCapabilities>()
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(false)
  const [privateError, setPrivateError] = useState(false)
  const [actionError, setActionError] = useState<number>()
  const [target, setTarget] = useState<BannerComment>()
  const [targetMissing, setTargetMissing] = useState(false)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<'published' | 'pending' | 'withdrawn'>()
  const live = useRef(false)
  const locked = useRef(false)
  const submission = useRef<{ text: string; id: string } | undefined>(undefined)
  const generation = useRef(0)

  const refresh = useCallback(async () => {
    const request = ++generation.current
    setLoading(true)
    setError(false)
    setPrivateError(false)
    // Fail closed while refreshing capabilities, including after a denied write.
    setCapabilities(undefined)
    const [publicResult, privateResult, capabilityResult, targetResult] =
      await Promise.all([
        getComments(bannerId),
        authenticated ? getOwnComments(bannerId) : undefined,
        authenticated ? getCommentCapabilities() : undefined,
        targetId ? getComment(bannerId, targetId) : undefined,
      ])
    if (!live.current || request !== generation.current) return
    if (publicResult.ok) setPage(publicResult.data)
    setError(!publicResult.ok)
    if (privateResult?.ok) setOwnPage(privateResult.data)
    if (capabilityResult?.ok) setCapabilities(capabilityResult.data)
    setPrivateError(
      authenticated && (!privateResult?.ok || !capabilityResult?.ok)
    )
    setTarget(targetResult?.ok ? targetResult.data : undefined)
    setTargetMissing(!!targetId && !targetResult?.ok)
    setLoading(false)
  }, [authenticated, bannerId, targetId])

  useEffect(() => {
    live.current = true
    if (initialized) void refresh()
    const invalidateRequests = () => generation.current++
    return () => {
      live.current = false
      invalidateRequests()
    }
  }, [initialized, refresh])

  const loadMore = async (own = false) => {
    const cursor = (own ? ownPage : page).nextCursor
    if (!cursor || locked.current) return
    locked.current = true
    setLoadingMore(true)
    const request = generation.current
    const result = await (own
      ? getOwnComments(bannerId, cursor)
      : getComments(bannerId, cursor))
    if (live.current && request === generation.current) {
      if (result.ok) {
        const update = own ? setOwnPage : setPage
        update((previous) => ({
          ...result.data,
          items: mergeComments(previous.items, result.data.items),
        }))
        setActionError(undefined)
      } else setActionError(result.status)
    }
    if (live.current) setLoadingMore(false)
    locked.current = false
  }

  const submit = async () => {
    if (
      locked.current ||
      !capabilities?.canComment ||
      !draft.trim() ||
      Array.from(draft).length > capabilities.maxLength
    )
      return false
    locked.current = true
    setBusy(true)
    setActionError(undefined)
    setNotice(undefined)
    // Retrying the same draft after an ambiguous network failure reuses its key.
    if (submission.current?.text !== draft) {
      submission.current = { text: draft, id: crypto.randomUUID() }
    }
    const result = await submitComment(bannerId, draft, submission.current.id)
    if (!live.current) return false
    if (result.ok) {
      const { comment, publishedCount, capabilities: next } = result.data
      setPage((previous) => ({
        ...previous,
        publishedCount,
        items:
          comment.status === 'PUBLISHED'
            ? mergeComments(previous.items, [comment])
            : previous.items,
      }))
      setOwnPage((previous) => ({
        ...previous,
        items: mergeComments(previous.items, [comment]),
      }))
      setCapabilities(next)
      setDraft('')
      submission.current = undefined
      setNotice(comment.status === 'PUBLISHED' ? 'published' : 'pending')
    } else {
      setActionError(result.status)
      if (result.status === 401 || result.status === 403) await refresh()
    }
    locked.current = false
    setBusy(false)
    return result.ok
  }

  const withdraw = async (id: string) => {
    if (locked.current) return
    locked.current = true
    setBusy(true)
    setActionError(undefined)
    setNotice(undefined)
    const result = await withdrawComment(id)
    if (!live.current) return
    if (result.ok) {
      setPage((previous) => ({
        ...previous,
        publishedCount: Math.max(
          0,
          previous.publishedCount -
            (previous.items.some((item) => item.id === id) ? 1 : 0)
        ),
        items: previous.items.filter((item) => item.id !== id),
      }))
      setOwnPage((previous) => ({
        ...previous,
        items: previous.items.filter((item) => item.id !== id),
      }))
      if (target?.id === id) setTarget(undefined)
      setNotice('withdrawn')
      await refresh()
    } else setActionError(result.status)
    locked.current = false
    setBusy(false)
  }

  return {
    page,
    ownPage,
    capabilities,
    loading,
    loadingMore,
    error,
    privateError,
    actionError,
    target,
    targetMissing,
    draft,
    setDraft,
    busy,
    notice,
    refresh,
    loadMore,
    submit,
    withdraw,
  }
}

export type BannerCommentsState = ReturnType<typeof useBannerComments>
