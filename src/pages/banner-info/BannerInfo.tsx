import React from 'react'
import { connect } from 'react-redux'
import {
  withRouter,
  RouteComponentProps,
  generatePath,
  Redirect,
} from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Trans, withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getBanner as getBannerSelector,
  loadBanner,
} from '../../features/banner'
import LoadingOverlay from '../../components/loading-overlay'
import { BannerInfoWithMap } from '../../components/banner-info-with-map'

import './BannerInfo.scss'

class BannerInfo extends React.Component<BannerInfoProps, BannerInfoState> {
  constructor(props: BannerInfoProps) {
    super(props)

    this.state = {
      status: 'initial',
    }
  }

  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(match.params.id)
      .then(() => this.setState({ status: 'ready' }))
      .catch(() => this.setState({ status: 'error' }))
  }

  render() {
    const { getBanner, match, i18n } = this.props
    const { status } = this.state
    const banner = getBanner(match.params.id)

    // When found ID different from loaded ID, redirect to loaded ID
    if (
      banner &&
      match?.params?.id &&
      match.params.id.localeCompare(banner.id, undefined, {
        sensitivity: 'accent',
      }) !== 0
    ) {
      const url = generatePath('/banner/:id', { id: banner.id })
      return <Redirect to={url} />
    }

    if (banner && banner.missions) {
      return (
        <>
          <Helmet defer={false}>
            <title>{banner.title}</title>
          </Helmet>
          <div className="banner-info-page">
            <BannerInfoWithMap banner={banner} />
          </div>
        </>
      )
    }
    if (status !== 'error') {
      return <LoadingOverlay active text={i18n!.t('loading')} />
    }
    return (
      <Trans i18nKey="banners.noneWithId">No banners found with that id</Trans>
    )
  }
}

export type BannerInfoProps = {
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
} & RouteComponentProps<{ id: string }> &
  WithTranslationProps

interface BannerInfoState {
  status: 'initial' | 'loading' | 'ready' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  getBanner: (id: string) => getBannerSelector(state, id),
})

const mapDispatchToProps = {
  fetchBanner: (id: string) => loadBanner(id),
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(BannerInfo)))
