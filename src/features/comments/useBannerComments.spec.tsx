// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteComment, getComments, saveComment } from './api'
import {
  useBannerComments,
  type BannerCommentsState,
} from './useBannerComments'
import type { ApiResponse } from '../../api'
import type { BannerComment, CommentDraft } from './types'

vi.mock('./api', () => ({
  deleteComment: vi.fn(),
  getComments: vi.fn(),
  saveComment: vi.fn(),
}))

const draft: CommentDraft = {
  comment: 'Unicode 🐸\nSecond line',
  ratingOverall: 5,
  ratingAccessibility: 3,
  ratingPassphrases: 4,
  ratingRoundTheClock: 'restricted',
}
const existing: BannerComment = {
  uuid: 'existing',
  created: '2026-11-08T12:00:00Z',
  author: { name: 'AgentName' },
  ...draft,
}
const ok = <T,>(data: T): ApiResponse<T> => ({ ok: true, status: 200, data })

describe('banner comments', () => {
  let root: Root
  let state: BannerCommentsState

  function Harness({
    authenticated,
    canPost,
    canModerate,
  }: {
    authenticated: boolean
    canPost: boolean
    canModerate: boolean
  }) {
    state = useBannerComments(
      'banner-slug',
      authenticated,
      canPost,
      canModerate
    )
    return null
  }

  const render = (authenticated = true, canPost = true, canModerate = false) =>
    act(() =>
      Promise.resolve(
        root.render(
          <Harness
            authenticated={authenticated}
            canPost={canPost}
            canModerate={canModerate}
          />
        )
      )
    )

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.resetAllMocks()
    vi.mocked(getComments).mockResolvedValue(ok([existing]))
    vi.mocked(saveComment).mockImplementation((_banner, uuid, body) =>
      Promise.resolve(ok({ ...existing, ...body, uuid }))
    )
    root = createRoot(document.createElement('div'))
  })

  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })

  it('skips all requests for guests', async () => {
    await render(false, false)
    act(() => state.setDraft(draft))
    await act(() => state.submit())
    expect(getComments).not.toHaveBeenCalled()
    expect(saveComment).not.toHaveBeenCalled()
  })

  it('loads the list for signed-in readers and checks roles before writes', async () => {
    await render(true, false)
    expect(getComments).toHaveBeenCalledWith('banner-slug')
    expect(state.items).toEqual([existing])
    act(() => state.setDraft(draft))
    await act(() => state.submit())
    await act(() => state.remove(existing.uuid))
    expect(saveComment).not.toHaveBeenCalled()
    expect(deleteComment).not.toHaveBeenCalled()
  })

  it('keeps the draft and reuses the client UUID on retry', async () => {
    vi.mocked(saveComment).mockResolvedValueOnce({ ok: false, status: 500 })
    await render()
    act(() => state.setDraft(draft))
    await act(() => state.submit())
    expect(state.draft).toEqual(draft)
    const uuid = vi.mocked(saveComment).mock.calls[0][1]
    expect(uuid).toMatch(/^[0-9a-f-]{36}$/)
    await act(() => state.submit())
    expect(saveComment).toHaveBeenLastCalledWith('banner-slug', uuid, draft)
    expect(state.items.map((item) => item.uuid)).toEqual([uuid, existing.uuid])
    expect(state.notice).toBe('published')
    expect(state.draft).toEqual({ comment: '' })
  })

  it('sends only one request when a save is already in progress', async () => {
    await render()
    act(() => state.setDraft(draft))
    await act(async () => {
      await Promise.all([state.submit(), state.submit()])
    })
    expect(saveComment).toHaveBeenCalledTimes(1)
  })

  it('edits only a confirmed own comment and keeps the published count', async () => {
    await render()
    act(() => state.edit(existing))
    expect(state.editingId).toBeUndefined()
    act(() => state.setDraft(draft))
    await act(() => state.submit())
    const saved = state.items[0]
    act(() => state.edit(saved))
    expect(state.draft).toEqual(draft)
    const edited = { ...draft, comment: 'Edited', ratingPassphrases: undefined }
    act(() => state.setDraft(edited))
    await act(() => state.submit())
    expect(saveComment).toHaveBeenLastCalledWith(
      'banner-slug',
      saved.uuid,
      edited
    )
    expect(state.items).toHaveLength(2)
    expect(state.items[0]).toMatchObject({
      uuid: saved.uuid,
      comment: 'Edited',
    })
    expect(state.notice).toBe('updated')
  })

  it('preserves the draft and blocks further writes after the backend denies posting', async () => {
    vi.mocked(saveComment).mockResolvedValueOnce({ ok: false, status: 403 })
    await render()
    act(() => state.setDraft(draft))
    await act(() => state.submit())
    expect(state.postingDenied).toBe(true)
    expect(state.draft).toEqual(draft)
    await act(() => state.submit())
    expect(saveComment).toHaveBeenCalledTimes(1)
  })

  it('removes items through the banner-scoped moderator endpoint', async () => {
    vi.mocked(deleteComment).mockResolvedValue(ok(undefined))
    await render(true, false, true)
    await act(() => state.remove(existing.uuid))
    expect(deleteComment).toHaveBeenCalledWith('banner-slug', existing.uuid)
    expect(state.items).toEqual([])
    expect(state.notice).toBe('deleted')
  })

  it('retries a failed list request', async () => {
    vi.mocked(getComments).mockResolvedValueOnce({ ok: false, status: 503 })
    await render()
    expect(state.loadError).toBe(true)
    await act(() => Promise.resolve(state.refresh()))
    expect(state.loadError).toBe(false)
    expect(state.items).toEqual([existing])
  })
})
