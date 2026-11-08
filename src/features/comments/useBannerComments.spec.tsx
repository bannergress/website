// @vitest-environment jsdom
import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getComment,
  getCommentCapabilities,
  getComments,
  getOwnComments,
  submitComment,
  withdrawComment,
} from './api'
import {
  useBannerComments,
  type BannerCommentsState,
} from './useBannerComments'
import type { BannerComment, CommentCapabilities, CommentPage } from './types'
import type { ApiResponse } from '../../api'

vi.mock('./api', () => ({
  getComment: vi.fn(),
  getCommentCapabilities: vi.fn(),
  getComments: vi.fn(),
  getOwnComments: vi.fn(),
  submitComment: vi.fn(),
  withdrawComment: vi.fn(),
}))

const caps: CommentCapabilities = {
  canComment: true,
  moderationMode: 'POSTMODERATION',
  testVerificationExemption: false,
  maxLength: 2000,
}
const published: BannerComment = {
  id: 'published',
  text: '<script>alert(1)</script>\nUnicode 🐈',
  createdAt: '2026-11-08T12:00:00Z',
  own: true,
  status: 'PUBLISHED',
  canWithdraw: true,
}
const pending: BannerComment = {
  ...published,
  id: 'pending',
  status: 'PENDING',
}
const ok = <T,>(data: T): ApiResponse<T> => ({ ok: true, status: 200, data })
const empty: CommentPage = { items: [], publishedCount: 0 }

describe('banner comments lifecycle', () => {
  let root: Root
  let container: HTMLDivElement
  let state: BannerCommentsState

  function Harness({
    authenticated = true,
    targetId,
  }: {
    authenticated?: boolean
    targetId?: string
  }) {
    state = useBannerComments('banner-slug', authenticated, true, targetId)
    return <p>{state.draft}</p>
  }

  beforeEach(() => {
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.resetAllMocks()
    vi.mocked(getComments).mockResolvedValue(ok(empty))
    vi.mocked(getOwnComments).mockResolvedValue(ok(empty))
    vi.mocked(getCommentCapabilities).mockResolvedValue(ok(caps))
    container = document.createElement('div')
    root = createRoot(container)
  })
  afterEach(() => {
    act(() => root.unmount())
    vi.unstubAllGlobals()
  })
  const render = (authenticated = true, key = 'user', targetId?: string) =>
    act(() =>
      Promise.resolve(
        root.render(
          <Harness
            key={key}
            authenticated={authenticated}
            targetId={targetId}
          />
        )
      )
    )
  const draft = (value: string) => act(() => state.setDraft(value))

  it('never requests private data for guests or grants writes when capabilities fail', async () => {
    await render(false, 'guest')
    expect(getOwnComments).not.toHaveBeenCalled()
    expect(getCommentCapabilities).not.toHaveBeenCalled()
    draft('Guest draft')
    await act(() => state.submit())
    expect(submitComment).not.toHaveBeenCalled()
    vi.mocked(getCommentCapabilities).mockResolvedValue({
      ok: false,
      status: 503,
    })
    await render(true, 'user')
    expect(state.privateError).toBe(true)
    draft('Signed in draft')
    await act(() => state.submit())
    expect(submitComment).not.toHaveBeenCalled()
  })

  it.each([
    'VERIFICATION_REQUIRED',
    'VERIFICATION_PENDING',
    'DISABLED',
  ] as const)(
    'blocks submitting for server denial %s',
    async (denialReason) => {
      vi.mocked(getCommentCapabilities).mockResolvedValue(
        ok({ ...caps, canComment: false, denialReason })
      )
      await render()
      draft('Cannot post')
      await act(() => state.submit())
      expect(submitComment).not.toHaveBeenCalled()
    }
  )

  it('keeps pending test-exempt posts private and preserves the published count', async () => {
    const testCaps = {
      ...caps,
      moderationMode: 'PREMODERATION' as const,
      testVerificationExemption: true,
    }
    vi.mocked(getCommentCapabilities).mockResolvedValue(ok(testCaps))
    vi.mocked(submitComment).mockResolvedValue(
      ok({ comment: pending, publishedCount: 0, capabilities: testCaps })
    )
    await render()
    draft('Test account 🐈\nNew line')
    await act(() => state.submit())
    expect(state.page).toEqual(empty)
    expect(state.ownPage.items).toEqual([pending])
    expect(state.notice).toBe('pending')
    expect(state.draft).toBe('')
    expect(state.capabilities?.testVerificationExemption).toBe(true)
  })

  it('preserves failed drafts and reuses submission identity while preventing duplicate clicks', async () => {
    let resolve!: (response: ApiResponse<never>) => void
    vi.mocked(submitComment).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await render()
    draft('  Unicode 🐈\nSecond line  ')
    let first!: Promise<boolean>
    act(() => {
      first = state.submit()
    })
    await act(() => state.submit())
    expect(submitComment).toHaveBeenCalledTimes(1)
    await act(async () => {
      resolve({ ok: false, status: 500 })
      await first
    })
    expect(state.draft).toBe('  Unicode 🐈\nSecond line  ')
    const id = vi.mocked(submitComment).mock.calls[0][2]
    vi.mocked(submitComment).mockResolvedValue(
      ok({ comment: published, publishedCount: 1, capabilities: caps })
    )
    await act(() => state.submit())
    expect(submitComment).toHaveBeenLastCalledWith(
      'banner-slug',
      '  Unicode 🐈\nSecond line  ',
      id
    )
    expect(state.page.items).toEqual([published])
    expect(state.page.publishedCount).toBe(1)
  })

  it('rejects blank and oversized drafts, counting Unicode code points', async () => {
    vi.mocked(getCommentCapabilities).mockResolvedValue(
      ok({ ...caps, maxLength: 2 })
    )
    await render()
    for (const value of [' \n ', 'abc']) {
      draft(value)
      await act(() => state.submit())
    }
    expect(submitComment).not.toHaveBeenCalled()
    vi.mocked(submitComment).mockResolvedValue({ ok: false, status: 429 })
    draft('🐈🐈')
    await act(() => state.submit())
    expect(submitComment).toHaveBeenCalledTimes(1)
    expect(state.actionError).toBe(429)
    expect(state.draft).toBe('🐈🐈')
  })

  it('refreshes revoked permissions after a denied write and retains the draft', async () => {
    await render()
    draft('Keep this draft after unlinking')
    vi.mocked(submitComment).mockResolvedValue({ ok: false, status: 403 })
    vi.mocked(getCommentCapabilities).mockResolvedValue(
      ok({ ...caps, canComment: false, denialReason: 'VERIFICATION_REQUIRED' })
    )
    await act(() => state.submit())
    expect(state.draft).toBe('Keep this draft after unlinking')
    expect(state.capabilities?.canComment).toBe(false)
    expect(state.actionError).toBe(403)
    await act(() => state.submit())
    expect(submitComment).toHaveBeenCalledTimes(1)
  })

  it('uses cursors, deduplicates overlapping pages and keeps private pagination separate', async () => {
    vi.mocked(getComments).mockResolvedValueOnce(
      ok({ items: [published], publishedCount: 2, nextCursor: 'public-cursor' })
    )
    vi.mocked(getOwnComments).mockResolvedValueOnce(
      ok({ items: [pending], publishedCount: 2, nextCursor: 'own-cursor' })
    )
    await render()
    const newer = {
      ...published,
      id: 'newer',
      createdAt: '2026-11-08T13:00:00Z',
    }
    vi.mocked(getComments).mockResolvedValue(
      ok({ items: [newer, published], publishedCount: 2 })
    )
    await act(() => state.loadMore())
    expect(getComments).toHaveBeenLastCalledWith('banner-slug', 'public-cursor')
    expect(state.page.items.map((item) => item.id)).toEqual([
      'newer',
      'published',
    ])
    await act(() => state.loadMore(true))
    expect(getOwnComments).toHaveBeenLastCalledWith('banner-slug', 'own-cursor')
    expect(state.page.items).not.toContainEqual(pending)
  })

  it('withdraws a comment and reloads authoritative counts and owner history', async () => {
    vi.mocked(getComments).mockResolvedValueOnce(
      ok({ items: [published], publishedCount: 1 })
    )
    vi.mocked(getOwnComments).mockResolvedValueOnce(
      ok({ items: [published], publishedCount: 1 })
    )
    vi.mocked(withdrawComment).mockResolvedValue(ok(undefined))
    await render()
    await act(() => state.withdraw(published.id))
    expect(withdrawComment).toHaveBeenCalledWith(published.id)
    expect(state.page).toEqual(empty)
    expect(state.ownPage.items).toEqual([])
    expect(state.notice).toBe('withdrawn')
  })

  it('clears private data and drafts on account changes and ignores late private responses', async () => {
    let resolve!: (response: ApiResponse<CommentPage>) => void
    vi.mocked(getOwnComments).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await render()
    draft('Private draft')
    await render(false, 'guest')
    await act(() => {
      resolve(ok({ items: [pending], publishedCount: 0 }))
      return Promise.resolve()
    })
    expect(state.ownPage.items).toEqual([])
    expect(state.draft).toBe('')
    expect(state.capabilities).toBeUndefined()
  })

  it.each([401, 403, 404])(
    'treats inaccessible permalink targets as unavailable (%s)',
    async (status) => {
      vi.mocked(getComment).mockResolvedValue({ ok: false, status })
      await render(false, 'guest', 'private-id')
      expect(getComment).toHaveBeenCalledWith('banner-slug', 'private-id')
      expect(state.target).toBeUndefined()
      expect(state.targetMissing).toBe(true)
      expect(state.targetError).toBe(false)
    }
  )

  it.each([429, 500, 503])(
    'allows retrying transient permalink errors (%s)',
    async (status) => {
      vi.mocked(getComment).mockResolvedValue({ ok: false, status })
      await render(false, 'guest', published.id)
      expect(state.targetMissing).toBe(false)
      expect(state.targetError).toBe(true)
      expect(state.error).toBe(false)
      vi.mocked(getComment).mockResolvedValue(ok(published))
      await act(() => state.refresh())
      expect(state.target).toEqual(published)
      expect(state.targetError).toBe(false)
      expect(state.targetMissing).toBe(false)
    }
  )

  it('does not report a known public comment as unavailable when its target request fails', async () => {
    vi.mocked(getComments).mockResolvedValue(
      ok({ items: [published], publishedCount: 1 })
    )
    vi.mocked(getComment).mockResolvedValue({ ok: false, status: 500 })
    await render(false, 'guest', published.id)
    expect(state.target).toEqual(published)
    expect(state.targetMissing).toBe(false)
    expect(state.targetError).toBe(false)
  })

  it('defers retry reads until a pending submission has committed', async () => {
    let resolve!: (response: Awaited<ReturnType<typeof submitComment>>) => void
    vi.mocked(getOwnComments).mockResolvedValueOnce({ ok: false, status: 500 })
    vi.mocked(submitComment).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    await render()
    expect(state.privateError).toBe(true)
    draft('Publishing while owner history is unavailable')
    let submission!: Promise<boolean>
    act(() => {
      submission = state.submit()
    })
    await act(() => state.refresh())
    expect(getComments).toHaveBeenCalledTimes(1)
    expect(getOwnComments).toHaveBeenCalledTimes(1)
    expect(state.busy).toBe(true)
    const committed = { items: [published], publishedCount: 1 }
    vi.mocked(getComments).mockResolvedValue(ok(committed))
    vi.mocked(getOwnComments).mockResolvedValue(ok(committed))
    await act(async () => {
      resolve(ok({ comment: published, publishedCount: 1, capabilities: caps }))
      await submission
    })
    expect(getComments).toHaveBeenCalledTimes(2)
    expect(state.page).toEqual(committed)
    expect(state.ownPage).toEqual(committed)
    expect(state.notice).toBe('published')
    expect(state.privateError).toBe(false)
  })

  it('prevents writes from starting during a refresh with older captured permissions', async () => {
    await render()
    draft('Do not race this write with a refresh')
    let resolve!: (response: ApiResponse<CommentPage>) => void
    vi.mocked(getComments).mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done
        })
    )
    let refresh!: Promise<void>
    act(() => {
      refresh = state.refresh()
    })
    await act(() => state.submit())
    await act(() => state.withdraw(published.id))
    expect(submitComment).not.toHaveBeenCalled()
    expect(withdrawComment).not.toHaveBeenCalled()
    await act(async () => {
      resolve(ok(empty))
      await refresh
    })
    expect(state.loading).toBe(false)
    expect(state.draft).toBe('Do not race this write with a refresh')
  })
})
