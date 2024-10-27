import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { Button, Carousel } from 'antd'
import { CarouselRef } from 'antd/lib/carousel'
import { Trans, useTranslation } from 'react-i18next'

import { Agent } from '../agent'
import LoadingOverlay from '../loading-overlay'

import './verify-account.less'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { User } from '../../features/user'
import { ApiResponse } from '../../api'
import {
  abortClaimUser,
  claimUser,
  getUser,
  unlinkUser,
} from '../../features/user/api'
import { Step3 } from './Step3'

type Status = 'pending' | 'resolved' | 'rejected'

const VerifyAccount: FC = () => {
  const slider = useRef<CarouselRef | null>()
  const [user, setUser] = useState<User>()
  const [status, setStatus] = useState<Status>('pending')
  const [isClaiming, setIsClaiming] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { t } = useTranslation()

  const verificationMessage = user?.verificationMessage
  const verificationAgent = user?.verificationAgent

  const handleApiRequest = useCallback(
    async (promise: Promise<ApiResponse<User>>) => {
      setStatus('pending')
      const result = await promise
      if (result.ok) {
        setStatus('resolved')
        setUser(result.data)
        setIsClaiming(Boolean(result.data.verificationMessage))
        if (!result.data.verificationMessage) {
          setIsCopied(false)
        }
      } else {
        setStatus('rejected')
      }
    },
    []
  )

  const onUnlink = useCallback(
    () => handleApiRequest(unlinkUser()),
    [handleApiRequest]
  )

  const onStep1Abort = useCallback(() => setIsClaiming(false), [setIsClaiming])

  const onStep1Claim = useCallback(
    (agent: string) => handleApiRequest(claimUser(agent)),
    [handleApiRequest]
  )

  const onStep2Abort = useCallback(
    () => handleApiRequest(abortClaimUser()),
    [handleApiRequest]
  )

  const onStep2Next = useCallback(() => setIsCopied(true), [setIsCopied])

  const onStep3Back = useCallback(() => setIsCopied(false), [setIsCopied])

  useEffect(() => {
    handleApiRequest(getUser())
  }, [handleApiRequest])

  useEffect(() => {
    if (verificationMessage && isCopied) {
      const id = setInterval(async () => {
        try {
        await handleApiRequest(getUser())
        } catch (e) {
        }
      }, 120_000)
      return () => clearTimeout(id)
    }
  }, [verificationMessage, isCopied, handleApiRequest])

  useEffect(() => {
    if (isClaiming && slider.current) {
      let page
      if (verificationMessage && isCopied) {
        page = 2
      } else if (verificationMessage) {
        page = 1
      } else {
        page = 0
      }
      slider.current.goTo(page)
    }
  }, [isClaiming, slider, isCopied, verificationMessage])

  let linkedAccount
  if (user?.agent) {
    linkedAccount = (
      <Trans
        i18nKey="account.linking.linked"
        components={{
          agent: <Agent agent={user.agent} linkToAgentProfile={false} />,
        }}
      />
    )
  } else {
    linkedAccount = t('account.linking.none')
  }

  let actions
  if (isClaiming) {
    actions = (
      <Carousel
        ref={(c) => {
          slider.current = c
        }}
        dots={false}
        swipe={false}
        draggable={false}
      >
        <Step1 onClaim={onStep1Claim} onAbort={onStep1Abort} />
        <Step2
          verificationMessage={verificationMessage}
          verificationAgent={verificationAgent}
          onNext={onStep2Next}
          onAbort={onStep2Abort}
        />
        <Step3 onBack={onStep3Back} />
      </Carousel>
    )
  } else if (user?.agent) {
    actions = (
      <div className="change-verification-buttons">
        <Button
          className="button-default"
          onClick={() => setIsClaiming(true)}
        >
          {t('account.linking.change')}
        </Button>
        <Button className="button-default" onClick={onUnlink}>
          {t('account.linking.unlink')}
        </Button>
      </div>
    )
  } else {
    actions = (
      <div>
        <Button
          className="positive-action-button"
          onClick={() => setIsClaiming(true)}
        >
          {t('account.linking.link')}
        </Button>
      </div>
    )
  }

  return (
    <div className="account-linking">
      <LoadingOverlay
        active={status === 'pending'}
        text={t('account.loading')}
      />
      <div>
        <h3>{t('account.linking.title')}</h3>
        <p>{linkedAccount}</p>
        {actions}
      </div>
    </div>
  )
}

export default VerifyAccount
