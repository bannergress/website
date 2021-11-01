import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Button, Carousel, Input } from 'antd'
import { CarouselRef } from 'antd/lib/carousel'
import { ThunkDispatch } from 'redux-thunk'
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

import './verify-account.less'
import { Issue } from '../Issues-list'

type AppDispatch = ThunkDispatch<RootState, any, UserActionTypes>

const isAccountLinked = (user: User) => user && user.agent
const isVerifying = (user: User) => !!user.verificationToken
const onCopyToken = (user: User) =>
  navigator.clipboard.writeText(user.verificationToken)

const VerifyAccount: React.FC<VerifyAccountProps> = ({
  currentUser,
  setIssues,
}) => {
  const dispatch: AppDispatch = useDispatch()
  const slider = useRef<CarouselRef | null>()
  const [isClaiming, setIsClaiming] = useState(false)
  const [agent, setAgent] = useState<string>(currentUser?.verificationAgent)
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

  const onClaim = () =>
    dispatch(claimUser(agent))
      .then(() => slider.current?.next())
      .catch((err) =>
        setIssues([
          {
            key: 'claim',
            message: err.message,
            type: 'error',
            field: 'verify',
          },
        ])
      )
  const onVerify = () => {
    dispatch(verifyUser())
      .then(() => {
        setIsClaiming(false)
        refreshToken()
      })
      .catch((err) =>
        setIssues([
          {
            key: 'verify',
            message: err.message,
            type: 'error',
            field: 'verify',
          },
        ])
      )
    setIsClaiming(false)
  }
  const onUnlinkUser = () =>
    dispatch(unlinkUser()).catch((err) =>
      setIssues([
        { key: 'unlink', message: err.message, type: 'error', field: 'verify' },
      ])
    )
  const onAbort = (user: User) => {
    if (user.verificationAgent) {
      dispatch(abortClaimUser(user.verificationAgent))
        .then(() => {
          setIsClaiming(false)
          setAgent('')
        })
        .catch((err) =>
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
  }

  const getClaimButtons = (user: User) => {
    if (isAccountLinked(user)) {
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
  }
  const onNext = () => slider.current?.next()
  const onBack = () => slider.current?.prev()

  const getCarousel = (user: User) => (
    <Carousel
      ref={(c) => {
        slider.current = c
      }}
      dots={false}
    >
      <div>
        {(isClaiming || isVerifying(user)) && (
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
              <Input value={agent} onChange={(e) => setAgent(e.target.value)} />
            </div>
            <div className="verify-steps-buttons">
              <Button
                className="button-default"
                onClick={() => onAbort(currentUser)}
              >
                <Trans i18nKey="buttons.abort">Abort</Trans>
              </Button>
              <Button className="button-default" onClick={onClaim}>
                <Trans i18nKey="buttons.next">Next</Trans>
              </Button>
            </div>
          </>
        )}
      </div>
      <div>
        <h3>
          <Trans i18nKey="account.linking.step2.title">2. Copy the token</Trans>
        </h3>
        <p>
          <Trans
            i18nKey="account.linking.step2.description"
            values={{ agent: user.verificationAgent }}
            components={{ span: <span className="verify-account-agent" /> }}
          >
            We have generated a token for you that allows to link &quot;
            <span className="verify-account-agent">
              {{ agent: user.verificationAgent }}
            </span>
            &quot; to your account. You need to copy this token for the next
            step.
          </Trans>
        </p>
        <div className="input-agent-token">
          <Input value={user.verificationToken} disabled />
          <Button className="button-default" onClick={() => onCopyToken(user)}>
            <Trans i18nKey="buttons.copy">Copy</Trans>
          </Button>
        </div>
        <div className="verify-steps-buttons">
          <Button className="button-default" onClick={onBack}>
            <Trans i18nKey="buttons.back">Back</Trans>
          </Button>
          <Button className="button-default" onClick={onNext}>
            <Trans i18nKey="buttons.next">Next</Trans>
          </Button>
        </div>
      </div>
      <div>
        <h3>
          <Trans i18nKey="account.linking.step3.title">3. Post the token</Trans>
        </h3>
        <p>
          <Trans i18nKey="account.linking.step3.description">
            You need to post the token as an activity on the Ingress Community
            Forum.
          </Trans>
        </p>
        <div className="verify-steps-buttons">
          <Button className="button-default" onClick={onBack}>
            <Trans i18nKey="buttons.back">Back</Trans>
          </Button>
          <Link
            className="forum-link"
            to={t<string>('linkin.step3.link')}
            target="_blank"
          >
            <Trans i18nKey="account.linking.step3.action">Take me there</Trans>
          </Link>
          <Button className="button-default" onClick={onNext}>
            <Trans i18nKey="buttons.next">Next</Trans>
          </Button>
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
  )

  return (
    <div className="account-linking">
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
        {!isClaiming &&
          !isVerifying(currentUser) &&
          getClaimButtons(currentUser)}
        {isClaiming && getCarousel(currentUser)}
      </div>
    </div>
  )
}

export interface VerifyAccountProps {
  currentUser: User
  setIssues: (issues: Array<Issue>) => void
}

export default VerifyAccount
