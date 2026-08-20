import { FC } from 'react'
import { Button } from 'antd'
import { useTranslation } from 'react-i18next'

interface Step3Props {
  onBack: () => void
}

export const Step3: FC<Step3Props> = ({ onBack }) => {
  const { t } = useTranslation()
  return (
    <div>
      <h3>{t('account.linking.step3.title')}</h3>
      <p>{t('account.linking.step3.description')}</p>
      <div className="verify-steps-buttons">
        <Button className="button-default" onClick={onBack}>
          {t('buttons.back')}
        </Button>
      </div>
    </div>
  )
}
