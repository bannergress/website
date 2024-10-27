import { Button, Input } from 'antd'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Step1Props {
  onClaim: (agent: string) => void
  onAbort: () => void
}

const isValidAgentName = (agent: string) => {
  return agent.length > 3
}

export const Step1: FC<Step1Props> = ({ onClaim, onAbort }) => {
  const [agent, setAgent] = useState<string>('')
  const { t } = useTranslation()
  const claim = useCallback(() => onClaim(agent), [onClaim, agent])
  return (
    <div>
      <h3>{t('account.linking.step1.title')}</h3>
      <p>{t('account.linking.step1.description')}</p>
      <div className="input-agent-name">
        <Input value={agent} onChange={(e) => setAgent(e.target.value)} />
      </div>
      <div className="verify-steps-buttons">
        <Button className="button-default" onClick={onAbort}>
          {t('buttons.abort')}
        </Button>
        <Button
          className="claim-button"
          onClick={claim}
          disabled={!isValidAgentName(agent)}
        >
          {t('account.linking.step1.action')}
        </Button>
      </div>
    </div>
  )
}
