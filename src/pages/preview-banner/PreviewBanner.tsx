import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Prompt, RouteComponentProps, withRouter } from 'react-router'
import { Beforeunload } from 'react-beforeunload'
import { Location } from 'history'
import { Helmet } from 'react-helmet'
import { withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getCreatedBanner,
  submitBanner as submitBannerAction,
  removePendingBanner as removePendingBannerAction,
} from '../../features/banner'
import LoadingOverlay from '../../components/loading-overlay'
import { BannerInfoWithMap } from '../../components/banner-info-with-map'

import './PreviewBanner.scss'

class PreviewBanner extends React.Component<
  PreviewBannerProps,
  PreviewBannerState
> {
  constructor(props: PreviewBannerProps) {
    super(props)
    this.state = {
      status: 'initial',
    }
  }

  componentDidMount() {
    const { history, banner } = this.props
    if (!banner) {
      history.goBack()
    }
  }

  componentWillUnmount() {
    const { removePendingBanner } = this.props
    const { status } = this.state
    if (status === 'loading') {
      removePendingBanner()
    }
  }

  onSubmitBanner = () => {
    const { submitBanner, history } = this.props
    this.setState({ status: 'loading' })
    submitBanner()
      .then((bannerId) => {
        history.push(`/banner/${bannerId}`)
      })
      .catch(() => this.setState({ status: 'error' }))
  }

  getPromptMessage = (location?: Location<unknown>) => {
    const { status } = this.state
    if (
      status !== 'initial' ||
      location?.pathname.includes('new-banner') ||
      location?.pathname.includes('edit-banner')
    ) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  onBack = () => {
    const { history } = this.props
    this.setState({ status: 'regress' }, () => history.goBack())
  }

  render() {
    const { banner, i18n } = this.props
    const { status } = this.state
    if (!banner) {
      return <Fragment />
    }

    return (
      <>
        <Helmet defer={false}>
          <title>{i18n?.t('banners.review.title')}</title>
        </Helmet>
        <Prompt message={this.getPromptMessage} />
        <Beforeunload onBeforeunload={() => this.getPromptMessage()} />

        <div className="banner-preview-page">
          <LoadingOverlay
            active={status === 'loading'}
            text={i18n!.t('banners.review.saving')}
          />
          <BannerInfoWithMap
            banner={banner}
            hideControls
            submitButton={i18n?.t('banners.review.submit')}
            onSubmitButtonClicked={this.onSubmitBanner}
            goBackLabel={i18n?.t('banners.creation.preview.title')}
            onGoBack={this.onBack}
          />
        </div>
      </>
    )
  }
}

export type PreviewBannerProps = {
  banner: Banner | undefined
  submitBanner: () => Promise<string>
  removePendingBanner: () => void
} & RouteComponentProps &
  WithTranslationProps

interface PreviewBannerState {
  status: 'initial' | 'loading' | 'regress' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banner: getCreatedBanner(state),
})

const mapDispatchToProps = {
  submitBanner: submitBannerAction,
  removePendingBanner: removePendingBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(PreviewBanner)))
