import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import illustration from '../../assets/img/error/agent-signal-lost.webp'
import { PageTitle } from '../../components/page-title/PageTitle'

import './PageError.scss'

// Keep this fallback independent of API requests so it also works during outages.
const PageError = () => {
  const { t } = useTranslation()

  return (
    <section className="page-error" aria-labelledby="page-error-title">
      <PageTitle title={t('error.unexpected.title')} />
      <img
        className="page-error__illustration"
        src={illustration}
        alt=""
        width={1733}
        height={907}
      />
      <h1 id="page-error-title">{t('error.unexpected.title')}</h1>
      <p className="page-error__description" role="alert">
        {t('error.unexpected.description')}
      </p>
      <div className="page-error__actions">
        <button
          type="button"
          className="page-error__reload"
          onClick={() => window.location.reload()}
        >
          {t('error.unexpected.reload')}
        </button>
        <Link className="page-error__home" to="/">
          {t('error.unexpected.home')}
        </Link>
      </div>
    </section>
  )
}

export default PageError
