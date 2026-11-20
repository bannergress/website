import { useEffect, useRef } from 'react'
import { Alert, Button, Input, Popconfirm, Select, Space, Spin } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { useTranslation } from 'react-i18next'
import { Agent } from '../agent/Agent'
import LoginButton from '../login/login-button'
import { handlePromise } from '../../features/utils/async'
import {
  commentRatingFields,
  type CommentRating,
  type RoundTheClockRating,
} from '../../features/comments/types'
import type { BannerCommentsState } from '../../features/comments/useBannerComments'
import './BannerComments.scss'

const stars: CommentRating[] = [1, 2, 3, 4, 5]

export function BannerComments({
  state,
  authenticated,
  canPost,
  canModerate,
  active,
  targetId,
}: {
  state: BannerCommentsState
  authenticated: boolean
  canPost: boolean
  canModerate: boolean
  active: boolean
  targetId?: string
}) {
  const { t, i18n } = useTranslation()
  const textarea = useRef<TextAreaRef>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const { items, draft, loading, busy, editingId, loadError, postingDenied } =
    state
  const targetFound = items.some((item) => item.uuid === targetId)
  const canWrite = canPost && !postingDenied

  useEffect(() => {
    if (!active || loading || !targetId || !targetFound) return
    const element = document.getElementById(`comment-${targetId}`)
    element?.scrollIntoView?.({ block: 'nearest' })
    element?.focus({ preventScroll: true })
  }, [active, loading, targetFound, targetId])

  useEffect(() => {
    if (active && editingId) textarea.current?.focus()
  }, [active, editingId])

  return (
    <section className="banner-comments" aria-label={t('comments.title')}>
      <div ref={feedback} tabIndex={-1} role="status" aria-live="polite">
        {state.notice && t(`comments.notice.${state.notice}`)}
      </div>
      {state.actionError && (
        <Alert
          type="error"
          showIcon
          title={t(
            state.actionError === 429
              ? 'comments.rateLimit'
              : state.actionError === 403
                ? 'comments.forbidden'
                : 'comments.actionError'
          )}
        />
      )}
      {!authenticated ? (
        <div className="banner-comments-composer">
          <p>{t('comments.signInRequired')}</p>
          <LoginButton className="positive-action-button">
            {t('comments.signIn')}
          </LoginButton>
        </div>
      ) : (
        <>
          {loading && (
            <div role="status" className="banner-comments-loading">
              <Spin /> {t('comments.loading')}
            </div>
          )}
          {loadError && (
            <Alert
              type="error"
              title={t('comments.loadError')}
              action={
                <Button disabled={busy || loading} onClick={state.refresh}>
                  {t('comments.retry')}
                </Button>
              }
            />
          )}
          {!canWrite && <p>{t('comments.disabled')}</p>}
          {(canWrite || state.hasDraft) && (
            <form
              className="banner-comments-composer"
              onSubmit={(event) => {
                event.preventDefault()
                handlePromise(
                  state.submit().then((success) => {
                    if (success) feedback.current?.focus()
                  })
                )
              }}
            >
              {canWrite && <p>{t('comments.postmoderation')}</p>}
              <label htmlFor="comment-draft">
                {t(editingId ? 'comments.edit' : 'comments.write')}
              </label>
              <Input.TextArea
                id="comment-draft"
                ref={textarea}
                value={draft.comment}
                onChange={(event) =>
                  state.setDraft({ ...draft, comment: event.target.value })
                }
                disabled={busy}
                autoSize={{ minRows: 4, maxRows: 10 }}
              />
              <div className="banner-comment-ratings">
                <div>
                  <label htmlFor="comment-ratingRoundTheClock">
                    {t('comments.ratingRoundTheClock')}
                  </label>
                  <Select<RoundTheClockRating | null>
                    id="comment-ratingRoundTheClock"
                    value={draft.ratingRoundTheClock ?? null}
                    placeholder={t('comments.noRating')}
                    allowClear
                    disabled={busy}
                    options={[
                      {
                        value: 'unrestricted',
                        label: t('comments.unrestricted'),
                      },
                      { value: 'restricted', label: t('comments.restricted') },
                    ]}
                    onChange={(ratingRoundTheClock) =>
                      state.setDraft({
                        ...draft,
                        ratingRoundTheClock: ratingRoundTheClock ?? undefined,
                      })
                    }
                  />
                </div>
                {commentRatingFields.map((field) => (
                  <div key={field}>
                    <label htmlFor={`comment-${field}`}>
                      {t(`comments.${field}`)}
                    </label>
                    <Select<CommentRating | null>
                      id={`comment-${field}`}
                      value={draft[field] ?? null}
                      placeholder={t('comments.noRating')}
                      allowClear
                      disabled={busy}
                      options={stars.map((value) => ({
                        value,
                        label: t('comments.stars', { value }),
                      }))}
                      onChange={(value) =>
                        state.setDraft({
                          ...draft,
                          [field]: value ?? undefined,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <Space wrap>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={busy}
                  disabled={
                    !canWrite || !draft.comment.trim() || loading || loadError
                  }
                >
                  {t(editingId ? 'comments.save' : 'comments.submit')}
                </Button>
                {editingId && (
                  <Button disabled={busy} onClick={state.resetDraft}>
                    {t('comments.cancel')}
                  </Button>
                )}
              </Space>
            </form>
          )}
          {targetId && !targetFound && !loading && !loadError && (
            <p role="status">{t('comments.unavailable')}</p>
          )}
          <div aria-busy={loading}>
            {!loading && !loadError && items.length === 0 && (
              <p>{t('comments.empty')}</p>
            )}
            {items.map((item) => (
              <article
                className="banner-comment"
                id={`comment-${item.uuid}`}
                key={item.uuid}
                tabIndex={-1}
              >
                <div className="banner-comment-heading">
                  {item.author?.faction ? (
                    <Agent
                      agent={{
                        name: item.author.name,
                        faction: item.author.faction,
                      }}
                      linkToAgentProfile={false}
                    />
                  ) : (
                    <span>
                      {item.author?.name ?? t('comments.anonymousAuthor')}
                    </span>
                  )}
                  <a href={`#comment-${encodeURIComponent(item.uuid)}`}>
                    <time dateTime={item.created}>
                      {new Date(item.created).toLocaleString(i18n.language)}
                    </time>
                  </a>
                </div>
                <p className="banner-comment-text">{item.comment}</p>
                {item.ratingRoundTheClock && (
                  <p>{t(`comments.${item.ratingRoundTheClock}`)}</p>
                )}
                {commentRatingFields.map((field) => {
                  const value = item[field]
                  return value === undefined ? null : (
                    <p key={field}>
                      {t(`comments.${field}`)} {t('comments.stars', { value })}
                    </p>
                  )
                })}
                {canWrite && state.editableIds.includes(item.uuid) && (
                  <Button
                    disabled={busy || loading || state.hasDraft}
                    onClick={() => state.edit(item)}
                  >
                    {t('comments.edit')}
                  </Button>
                )}
                {canModerate && (
                  <Popconfirm
                    title={t('comments.deleteConfirm')}
                    okText={t('comments.delete')}
                    cancelText={t('comments.cancel')}
                    onConfirm={() =>
                      handlePromise(
                        state
                          .remove(item.uuid)
                          .then(() => feedback.current?.focus())
                      )
                    }
                  >
                    <Button danger disabled={busy || loading}>
                      {t('comments.delete')}
                    </Button>
                  </Popconfirm>
                )}
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  )
}
