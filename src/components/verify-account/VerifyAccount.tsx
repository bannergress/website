import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button, Carousel, Input } from 'antd'
import { CarouselRef } from 'antd/lib/carousel'
import { ThunkDispatch, ThunkAction } from 'redux-thunk'
import { Trans, useTranslation } from 'react-i18next'

import {
  abortClaimUser,
  claimUser,
  unlinkUser,
  User,
  verifyUser,
} from '../../features/user'
import { UserActionTypes } from '../../features/user/actionTypes'
import { RootState } from '../../storeTypes'
import { useRefreshToken } from '../../hooks/RefreshToken'
import { Agent } from '../agent'
import { Issue } from '../Issues-list'
import LoadingOverlay from '../loading-overlay'

import './verify-account.less'

type AppDispatch = ThunkDispatch<RootState, any, UserActionTypes>
type AppAction = ThunkAction<Promise<any>, RootState, any, UserActionTypes>

const isAccountLinked = (user: User) => user && user.agent
const isVerifying = (user: User) => !!user.verificationToken

const VerifyAccount: React.FC<VerifyAccountProps> = ({
  currentUser,
  setIssues,
}) => {
  const dispatch: AppDispatch = useDispatch()
  const slider = useRef<CarouselRef | null>()
  const [isClaiming, setIsClaiming] = useState(false)
  const [agent, setAgent] = useState<string>(currentUser?.verificationAgent)
  const [loading, setLoading] = useState(false)
  const refreshToken = useRefreshToken()
  const { t } = useTranslation(undefined, { keyPrefix: 'account' })

  useEffect(() => {
    if (currentUser.verificationAgent) {
      setAgent(currentUser.verificationAgent)
      setIsClaiming(true)
      if (slider.current) {
        slider.current.goTo(1)
      }
    }
  }, [currentUser, setAgent, setIsClaiming])

  const dispatchWithLoading = useCallback(
    (
      action: AppAction,
      onSuccess?: () => void,
      onError?: (err: any) => void
    ) => {
      setLoading(true)
      dispatch(action)
        .then(() => {
          if (onSuccess) onSuccess()
        })
        .catch((err) => {
          if (onError) onError(err)
        })
        .finally(() => setLoading(false))
    },
    [dispatch]
  )

  const onClaim = useCallback(() => {
    if (currentUser.verificationAgent !== agent) {
      dispatchWithLoading(
        claimUser(agent),
        () => slider.current?.next(),
        (err) =>
          setIssues([
            {
              key: 'claim',
              message: err.message,
              type: 'error',
              field: 'verify',
            },
          ])
      )
    } else {
      slider.current?.next()
    }
  }, [currentUser.verificationAgent, agent, dispatchWithLoading, setIssues])

  const onVerify = useCallback(() => {
    dispatchWithLoading(
      verifyUser(),
      () => {
        setIsClaiming(false)
        refreshToken()
      },
      (err) =>
        setIssues([
          {
            key: 'verify',
            message: err.message,
            type: 'error',
            field: 'verify',
          },
        ])
    )
  }, [dispatchWithLoading, refreshToken, setIssues])

  const onUnlinkUser = useCallback(() => {
    dispatchWithLoading(unlinkUser(), undefined, (err) =>
      setIssues([
        {
          key: 'unlink',
          message: err.message,
          type: 'error',
          field: 'verify',
        },
      ])
    )
  }, [dispatchWithLoading, setIssues])

  const onAbort = useCallback(() => {
    if (currentUser.verificationAgent) {
      dispatchWithLoading(
        abortClaimUser(currentUser.verificationAgent),
        () => {
          setIsClaiming(false)
          setAgent('')
        },
        (err) =>
          setIssues([
            {
              key: 'claim',
              message: err.message,
              type: 'error',
              field: 'verify',
            },
          ])
      )
    } else {
      setIsClaiming(false)
      setAgent('')
    }
  }, [currentUser.verificationAgent, dispatchWithLoading, setIssues])

  const getClaimButtons = useCallback(() => {
    if (isAccountLinked(currentUser)) {
      return (
        <div className="change-verification-buttons">
          <Button
            className="button-default"
            onClick={() => setIsClaiming(true)}
          >
            <Trans i18nKey="account.linking.change">
              Change Linked Account
            </Trans>
          </Button>
          <Button className="button-default" onClick={onUnlinkUser}>
            <Trans i18nKey="account.linking.unlink">Unlink Account</Trans>
          </Button>
        </div>
      )
    }
    return (
      <div>
        <Button
          className="positive-action-button"
          onClick={() => setIsClaiming(true)}
        >
          <Trans i18nKey="account.linking.link">Link Ingress Account</Trans>
        </Button>
      </div>
    )
  }, [currentUser, onUnlinkUser])

  const onNext = useCallback(() => slider.current?.next(), [])

  const onBack = useCallback(() => slider.current?.prev(), [])

  const onCopyToken = useCallback(() => {
    navigator.clipboard.writeText(currentUser.verificationToken)
    onNext()
  }, [currentUser.verificationToken, onNext])

  const getCarousel = useCallback(
    () => (
      <Carousel
        ref={(c) => {
          slider.current = c
        }}
        dots={false}
        swipe={false}
        draggable={false}
      >
        <div>
          {(isClaiming || isVerifying(currentUser)) && (
            <>
              <h3>
                <Trans i18nKey="account.linking.step1.title">
                  1. What&apos;s your Agent name?
                </Trans>
              </h3>
              <p>
                <Trans i18nKey="account.linking.step1.description">
                  Make sure it&apos;s spelled correctly, otherwise we won&apos;t
                  be able to verify it.
                </Trans>
              </p>
              <div className="input-agent-name">
                <Input
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                />
              </div>
              <div className="verify-steps-buttons">
                <Button className="button-default" onClick={onAbort}>
                  <Trans i18nKey="buttons.abort">Abort</Trans>
                </Button>
                <Button
                  className="claim-button"
                  onClick={onClaim}
                  disabled={!agent || agent.length < 3}
                >
                  <Trans i18nKey="account.linking.step1.action">Continue</Trans>
                </Button>
              </div>
            </>
          )}
        </div>
        <div>
          <h3>
            <Trans i18nKey="account.linking.step2.title">
              2. Copy the token
            </Trans>
          </h3>
          <p>
            <Trans
              i18nKey="account.linking.step2.description"
              values={{ agent: currentUser.verificationAgent }}
              components={{ span: <span className="verify-account-agent" /> }}
            >
              We have generated a token for you that allows to link &quot;
              <span className="verify-account-agent">
                {{ agent: currentUser.verificationAgent }}
              </span>
              &quot; to your account. You need to copy this token for the next
              step.
            </Trans>
          </p>
          <div className="input-agent-token">
            <Input value={currentUser.verificationToken} disabled />
          </div>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              <Trans i18nKey="buttons.back">Back</Trans>
            </Button>
            <Button className="positive-action-button" onClick={onCopyToken}>
              <Trans i18nKey="account.linking.step2.action">
                Copy and continue
              </Trans>
            </Button>
          </div>
        </div>
        <div>
          <h3>
            <Trans i18nKey="account.linking.step3.title">
              3. Post the token
            </Trans>
          </h3>
          <p>
            <Trans i18nKey="account.linking.step3.description">
              You need to post the token as an activity on the Ingress Community
              Forum. (Make sure you are logged in there!)
            </Trans>
          </p>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              <Trans i18nKey="buttons.back">Back</Trans>
            </Button>
            <Link
              className="forum-link"
              to={t<string>('linking.step3.link')}
              target="_blank"
              onClick={onNext}
            >
              <Trans i18nKey="account.linking.step3.action">
                Take me there and continue
              </Trans>
            </Link>
          </div>
        </div>
        <div>
          <h3>
            <Trans i18nKey="account.linking.step4.title">
              4. Complete verification
            </Trans>
          </h3>
          <p>
            <Trans i18nKey="account.linking.step4.description">
              Have you posted your token yet? Let us check.
            </Trans>
          </p>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              <Trans i18nKey="buttons.back">Back</Trans>
            </Button>
            <Button className="positive-action-button" onClick={onVerify}>
              <Trans i18nKey="buttons.verify">Verify</Trans>
            </Button>
          </div>
        </div>
      </Carousel>
    ),
    [
      agent,
      currentUser,
      isClaiming,
      onAbort,
      onBack,
      onClaim,
      onCopyToken,
      onNext,
      onVerify,
      t,
    ]
  )

  return (
    <div className="account-linking">
      <LoadingOverlay
        active={loading}
        fadeSpeed={300}
        spinner
        text={t('loading')}
      />
      <div>
        <h3>
          <Trans i18nKey="account.linking.title">Link Ingress Account</Trans>
        </h3>
        {!isAccountLinked(currentUser) && (
          <p>
            <Trans i18nKey="account.none">
              No account linked to your Bannergress profile
            </Trans>
          </p>
        )}
        {isAccountLinked(currentUser) && (
          <p>
            <Trans
              i18nKey="account.linking.linked"
              components={{
                agent: (
                  <Agent agent={currentUser.agent} linkToAgentProfile={false} />
                ),
              }}
            >
              Account linked:{' '}
              <Agent agent={currentUser.agent} linkToAgentProfile={false} />
            </Trans>
          </p>
        )}
        {!isClaiming && !isVerifying(currentUser) && getClaimButtons()}
        {isClaiming && getCarousel()}
      </div>
    </div>
  )
}

export interface VerifyAccountProps {
  currentUser: User
  setIssues: (issues: Array<Issue>) => void
}

export default VerifyAccount
