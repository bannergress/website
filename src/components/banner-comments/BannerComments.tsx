import { useEffect, useRef } from 'react'
import { Alert, Button, Input, Popconfirm, Spin, Tag } from 'antd'
import type { TextAreaRef } from 'antd/es/input/TextArea'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LoginButton from '../login/login-button'
import { handlePromise } from '../../features/utils/async'
import type { BannerComment } from '../../features/comments/types'
import type { BannerCommentsState } from '../../features/comments/useBannerComments'
import './BannerComments.scss'

export function BannerComments({
  state,
  authenticated,
  active,
  targetId,
}: {
  state: BannerCommentsState
  authenticated: boolean
  active: boolean
  targetId?: string
}) {
  const { t, i18n } = useTranslation()
  const textarea = useRef<TextAreaRef>(null)
  const feedback = useRef<HTMLDivElement>(null)
  const { capabilities: caps } = state
  const length = Array.from(state.draft).length
  const maxLength = caps?.maxLength ?? 2000
  const own = authenticated ? state.ownPage.items : []
  const publicItems = state.page.items.map(
    (item) => own.find((entry) => entry.id === item.id) ?? item
  )
  const privateItems = own.filter((item) => item.status !== 'PUBLISHED')
  const target = state.target
  const targetOutsidePage =
    target &&
    ![...publicItems, ...privateItems].some((item) => item.id === target.id)

  useEffect(() => {
    if (!active || state.loading || !targetId) return
    const element = document.getElementById(`comment-${targetId}`)
    element?.scrollIntoView?.({ block: 'nearest' })
    element?.focus({ preventScroll: true })
  }, [active, state.loading, targetId])

  const renderComment = (comment: BannerComment) => {
    const isOwner = authenticated && comment.own === true
    const author = authenticated ? comment.author : undefined
    return (
      <article
        className="banner-comment"
        id={`comment-${comment.id}`}
        key={comment.id}
        tabIndex={-1}
      >
        <div className="banner-comment-heading">
          <span>{author?.displayName || t('comments.anonymousAuthor')}</span>
          {author?.ingressVerified && <Tag>{t('comments.verified')}</Tag>}
          <a href={`#comment-${encodeURIComponent(comment.id)}`}>
            <time dateTime={comment.createdAt}>
              {new Date(comment.createdAt).toLocaleString(i18n.language)}
            </time>
          </a>
        </div>
        <p className="banner-comment-text">{comment.text}</p>
        {isOwner && comment.status && (
          <div className="banner-comment-status">
            <Tag>{t(`comments.status.${comment.status}`)}</Tag>
            {comment.moderationReason && <p>{comment.moderationReason}</p>}
          </div>
        )}
        {isOwner && comment.canWithdraw && (
          <Popconfirm
            title={t('comments.withdrawConfirm')}
            okText={t('comments.withdraw')}
            cancelText={t('comments.cancel')}
            onConfirm={() =>
              handlePromise(
                state.withdraw(comment.id).then(() => feedback.current?.focus())
              )
            }
          >
            <Button danger disabled={state.busy}>
              {t('comments.withdraw')}
            </Button>
          </Popconfirm>
        )}
      </article>
    )
  }

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
              : 'comments.actionError'
          )}
        />
      )}
      {state.loading && (
        <div role="status" className="banner-comments-loading">
          <Spin /> {t('comments.loading')}
        </div>
      )}
      {state.error && (
        <Alert
          type="error"
          title={t('comments.loadError')}
          action={
            <Button onClick={() => handlePromise(state.refresh())}>
              {t('comments.retry')}
            </Button>
          }
        />
      )}
      {authenticated && state.privateError && (
        <Alert
          type="error"
          title={t('comments.privateError')}
          action={
            <Button onClick={() => handlePromise(state.refresh())}>
              {t('comments.retry')}
            </Button>
          }
        />
      )}
      {!authenticated ? (
        <div className="banner-comments-composer">
          <p>{t('comments.signInRequired')}</p>
          <LoginButton className="positive-action-button">
            {t('comments.signIn')}
          </LoginButton>
        </div>
      ) : caps?.canComment ? (
        <form
          className="banner-comments-composer"
          onSubmit={(event) => {
            event.preventDefault()
            handlePromise(
              state.submit().then((success) => {
                if (success) textarea.current?.focus({ preventScroll: true })
              })
            )
          }}
        >
          {caps.testVerificationExemption && (
            <Alert type="info" title={t('comments.testExemption')} />
          )}
          <p id="comment-policy">
            {t(
              caps.moderationMode === 'PREMODERATION'
                ? 'comments.premoderation'
                : 'comments.postmoderation'
            )}
          </p>
          <label htmlFor="comment-draft">{t('comments.write')}</label>
          <Input.TextArea
            id="comment-draft"
            ref={textarea}
            value={state.draft}
            onChange={(event) => state.setDraft(event.target.value)}
            disabled={state.busy}
            autoSize={{ minRows: 4, maxRows: 10 }}
            aria-describedby="comment-policy comment-length"
            aria-invalid={length > maxLength}
          />
          <span
            id="comment-length"
            role={length > maxLength ? 'alert' : undefined}
          >
            {t('comments.length', { length, maxLength })}
          </span>
          <Button
            type="primary"
            htmlType="submit"
            loading={state.busy}
            disabled={
              !state.draft.trim() ||
              length > maxLength ||
              state.loading ||
              state.loadingMore
            }
          >
            {t('comments.submit')}
          </Button>
        </form>
      ) : caps ? (
        <div className="banner-comments-composer">
          <p>
            {t(
              caps.denialReason === 'VERIFICATION_PENDING'
                ? 'comments.verificationPending'
                : caps.denialReason === 'VERIFICATION_REQUIRED'
                  ? 'comments.verificationRequired'
                  : 'comments.disabled'
            )}
          </p>
          {(caps.denialReason === 'VERIFICATION_PENDING' ||
            caps.denialReason === 'VERIFICATION_REQUIRED') && (
            <Link to="/account">{t('comments.verifyAccount')}</Link>
          )}
        </div>
      ) : null}
      {state.targetMissing && !state.loading && (
        <p role="status">{t('comments.unavailable')}</p>
      )}
      {targetOutsidePage && renderComment(target)}
      {privateItems.length > 0 && (
        <div>
          <h3>{t('comments.ownTitle')}</h3>
          {privateItems.map(renderComment)}
        </div>
      )}
      {authenticated && state.ownPage.nextCursor && (
        <Button
          loading={state.loadingMore}
          disabled={state.busy || state.loading}
          onClick={() => handlePromise(state.loadMore(true))}
        >
          {t('comments.loadMoreOwn')}
        </Button>
      )}
      <div aria-busy={state.loading}>
        {!state.loading && !state.error && publicItems.length === 0 && (
          <p>{t('comments.empty')}</p>
        )}
        {publicItems.map(renderComment)}
      </div>
      {state.page.nextCursor && (
        <Button
          loading={state.loadingMore}
          disabled={state.busy || state.loading}
          onClick={() => handlePromise(state.loadMore())}
        >
          {t('comments.loadMore')}
        </Button>
      )}
    </section>
  )
}
