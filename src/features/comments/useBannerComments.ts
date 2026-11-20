import { useEffect, useRef, useState } from 'react'
import { deleteComment, getComments, saveComment } from './api'
import type { BannerComment, CommentDraft } from './types'

const emptyDraft: CommentDraft = { comment: '' }

// The caller remounts this component when the banner or signed-in subject changes.
export function useBannerComments(
  bannerId: string,
  authenticated: boolean,
  canPost: boolean,
  canModerate: boolean
) {
  const [items, setItems] = useState<BannerComment[]>([])
  const [loading, setLoading] = useState(authenticated)
  const [loadError, setLoadError] = useState(false)
  const [reloadVersion, setReloadVersion] = useState(0)
  const [actionError, setActionError] = useState<number>()
  const [postingDenied, setPostingDenied] = useState(false)
  const [draft, setDraft] = useState<CommentDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string>()
  const [editableIds, setEditableIds] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<'published' | 'updated' | 'deleted'>()
  const locked = useRef(false)
  const newCommentId = useRef<string>(undefined)
  const hasDraft = Object.values(draft).some(
    (value) => value !== '' && value !== undefined
  )

  useEffect(() => {
    if (!authenticated) return
    let ignore = false
    void getComments(bannerId).then((result) => {
      if (ignore) return
      if (result.ok) setItems(result.data)
      setLoadError(!result.ok)
      setLoading(false)
    })
    return () => {
      ignore = true
    }
  }, [authenticated, bannerId, reloadVersion])

  const refresh = () => {
    if (!authenticated || locked.current || loading) return
    setLoading(true)
    setReloadVersion((version) => version + 1)
  }

  const startAction = () => {
    locked.current = true
    setBusy(true)
    setActionError(undefined)
    setNotice(undefined)
  }

  const finishAction = () => {
    locked.current = false
    setBusy(false)
  }

  const resetDraft = () => {
    setDraft(emptyDraft)
    setEditingId(undefined)
    newCommentId.current = undefined
  }

  const submit = async () => {
    if (
      !authenticated ||
      !canPost ||
      postingDenied ||
      locked.current ||
      loading ||
      loadError ||
      !draft.comment.trim()
    ) {
      return false
    }
    startAction()
    // The same UUID updates the same comment if the first response was lost.
    const uuid = editingId ?? (newCommentId.current ??= crypto.randomUUID())
    const result = await saveComment(bannerId, uuid, draft)
    if (result.ok) {
      const saved = result.data
      setItems((previous) =>
        previous.some((item) => item.uuid === saved.uuid)
          ? previous.map((item) => (item.uuid === saved.uuid ? saved : item))
          : [saved, ...previous]
      )
      if (!editingId) setEditableIds((ids) => [...ids, saved.uuid])
      resetDraft()
      setNotice(editingId ? 'updated' : 'published')
    } else {
      setActionError(result.status)
      if (result.status === 403) setPostingDenied(true)
    }
    finishAction()
    return result.ok
  }

  const edit = (item: BannerComment) => {
    if (
      !canPost ||
      postingDenied ||
      locked.current ||
      loading ||
      hasDraft ||
      !editableIds.includes(item.uuid)
    ) {
      return
    }
    const {
      comment,
      ratingRoundTheClock,
      ratingOverall,
      ratingAccessibility,
      ratingPassphrases,
    } = item
    setDraft({
      comment,
      ratingRoundTheClock,
      ratingOverall,
      ratingAccessibility,
      ratingPassphrases,
    })
    setEditingId(item.uuid)
    setActionError(undefined)
    setNotice(undefined)
  }

  const remove = async (uuid: string) => {
    if (!canModerate || locked.current || loading) return
    startAction()
    const result = await deleteComment(bannerId, uuid)
    if (result.ok) {
      setItems((previous) => previous.filter((item) => item.uuid !== uuid))
      setEditableIds((ids) => ids.filter((id) => id !== uuid))
      if (editingId === uuid) resetDraft()
      if (newCommentId.current === uuid) newCommentId.current = undefined
      setNotice('deleted')
    } else {
      setActionError(result.status)
    }
    finishAction()
  }

  return {
    items,
    loading,
    loadError,
    actionError,
    postingDenied,
    draft,
    hasDraft,
    setDraft,
    editingId,
    editableIds,
    busy,
    notice,
    refresh,
    submit,
    edit,
    resetDraft,
    remove,
  }
}

export type BannerCommentsState = ReturnType<typeof useBannerComments>
