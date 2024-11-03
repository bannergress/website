import { FC, useCallback } from 'react'
import { Button, Input } from 'antd'
import { Trans, useTranslation } from 'react-i18next'

interface Step2Props {
  verificationMessage: string | undefined
  verificationAgent: string | undefined
  onNext: () => void
  onAbort: () => void
}

export const Step2: FC<Step2Props> = ({
  verificationMessage,
  verificationAgent,
  onNext,
  onAbort,
}) => {
  const { t } = useTranslation()
  const copyToken = useCallback(async () => {
    await navigator.clipboard.writeText(verificationMessage!)
    onNext()
  }, [onNext, verificationMessage])
  return (
    <div>
      <h3>{t('account.linking.step2.title')}</h3>
      <p>
        <Trans
          i18nKey="account.linking.step2.description"
          values={{ agent: verificationAgent }}
          components={{ span: <span className="verify-account-agent" /> }}
        />
      </p>
      <div className="input-agent-token">
        <Input value={verificationMessage} disabled />
      </div>
      <div className="verify-steps-buttons">
        <Button className="button-default" onClick={onAbort}>
          {t('buttons.abort')}
        </Button>
        <Button className="positive-action-button" onClick={copyToken}>
          {t('account.linking.step2.action')}
        </Button>
      </div>
    </div>
  )
}
