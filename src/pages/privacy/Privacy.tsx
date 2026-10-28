import { FC, useLayoutEffect, useRef } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'

import FooterMain from '../../components/footer-main'
import { PageTitle } from '../../components/page-title/PageTitle'
import { getExternalLinkAttributes } from '../../features/utils'

import './Privacy.scss'

const sections = [
  'account',
  'use',
  'contributions',
  'location',
  'storage',
  'sharing',
  'retention',
  'rights',
  'changes',
] as const

const Privacy: FC = () => {
  const { t } = useTranslation('privacy')
  const { t: translateCommon } = useTranslation()
  const { key: locationKey } = useLocation()
  const pageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    // Routes share this scroll container; reset before paint, even on a repeat visit.
    pageRef.current
      ?.closest('.container')
      ?.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [locationKey])

  const components = {
    p: <p />,
    ul: <ul />,
    li: <li />,
    account: <Link to="/account" />,
    support: (
      <a
        {...getExternalLinkAttributes()}
        href={translateCommon('help.telegram.support.link')}
      />
    ),
    googlePolicy: (
      <a
        {...getExternalLinkAttributes()}
        href="https://developers.google.com/terms/api-services-user-data-policy"
      />
    ),
    googleConnections: (
      <a
        {...getExternalLinkAttributes()}
        href="https://myaccount.google.com/connections"
      />
    ),
    osmPrivacy: (
      <a
        {...getExternalLinkAttributes()}
        href="https://osmfoundation.org/wiki/Privacy_Policy"
      />
    ),
  }

  return (
    <div className="page-container" ref={pageRef}>
      <PageTitle title={t('title')} />
      <article className="privacy-page" aria-labelledby="privacy-title">
        <h1 id="privacy-title">{t('title')}</h1>
        <p className="privacy-updated">
          {t('updated')} <time dateTime="2026-10-22">{t('date')}</time>
        </p>
        <p>{t('intro')}</p>
        {sections.map((section) => (
          <section key={section} aria-labelledby={`privacy-${section}`}>
            <h2 id={`privacy-${section}`}>{t(`${section}.title`)}</h2>
            <Trans
              ns="privacy"
              i18nKey={`${section}.body`}
              components={components}
            />
          </section>
        ))}
      </article>
      <FooterMain />
    </div>
  )
}

export default Privacy
