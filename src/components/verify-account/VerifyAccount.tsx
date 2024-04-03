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
  const { t } = useTranslation()

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
    if (confirm(t('account.linking.unlinkWarning'))) {
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
    }
  }, [dispatchWithLoading, setIssues, t])

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
            hidden
          >
            {t('account.linking.change')}
          </Button>
          <Button className="button-default" onClick={onUnlinkUser}>
            {t('account.linking.unlink')}
          </Button>
        </div>
      )
    }
    return (
      <div>
        <Button
          className="positive-action-button"
          onClick={() => setIsClaiming(true)}
          hidden
        >
          {t('account.linking.link')}
        </Button>
      </div>
    )
  }, [currentUser, onUnlinkUser, t])

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
              <h3>{t('account.linking.step1.title')}</h3>
              <p>{t('account.linking.step1.description')}</p>
              <div className="input-agent-name">
                <Input
                  value={agent}
                  onChange={(e) => setAgent(e.target.value)}
                />
              </div>
              <div className="verify-steps-buttons">
                <Button className="button-default" onClick={onAbort}>
                  {t('buttons.abort')}
                </Button>
                <Button
                  className="claim-button"
                  onClick={onClaim}
                  disabled={!agent || agent.length < 3}
                >
                  {t('account.linking.step1.action')}
                </Button>
              </div>
            </>
          )}
        </div>
        <div>
          <h3>{t('account.linking.step2.title')}</h3>
          <p>
            <Trans
              i18nKey="account.linking.step2.description"
              values={{ agent: currentUser.verificationAgent }}
              components={{ span: <span className="verify-account-agent" /> }}
            />
          </p>
          <div className="input-agent-token">
            <Input value={currentUser.verificationToken} disabled />
          </div>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              {t('buttons.back')}
            </Button>
            <Button className="positive-action-button" onClick={onCopyToken}>
              {t('account.linking.step2.action')}
            </Button>
          </div>
        </div>
        <div>
          <h3>{t('account.linking.step3.title')}</h3>
          <p>{t('account.linking.step3.description')}</p>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              {t('buttons.back')}
            </Button>
            <Link
              className="forum-link"
              to={t('account.linking.step3.link')}
              target="_blank"
              onClick={onNext}
            >
              {t('account.linking.step3.action')}
            </Link>
          </div>
        </div>
        <div>
          <h3>{t('account.linking.step4.title')}</h3>
          <p>{t('account.linking.step4.description')}</p>
          <div className="verify-steps-buttons">
            <Button className="button-default" onClick={onBack}>
              {t('buttons.back')}
            </Button>
            <Button className="positive-action-button" onClick={onVerify}>
              {t('account.linking.step4.action')}
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
        text={t('account.loading')}
      />
      <div>
        <h3>{t('account.linking.title')}</h3>
        {!isAccountLinked(currentUser) && <p>{t('account.linking.none')}</p>}
        {isAccountLinked(currentUser) && (
          <p>
            <Trans
              i18nKey="account.linking.linked"
              components={{
                agent: (
                  <Agent agent={currentUser.agent} linkToAgentProfile={false} />
                ),
              }}
            />
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
