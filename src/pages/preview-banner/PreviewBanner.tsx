import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Prompt, RouteComponentProps, withRouter } from 'react-router'
import { Location } from 'history'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getCreatedBanner,
  submitBanner as submitBannerAction,
  removePendingBanner as removePendingBannerAction,
} from '../../features/banner'
import LoadingOverlay from '../../components/loading-overlay'
import { BannerInfoWithMap } from '../../components/banner-info-with-map'

import './preview-banner.less'

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

  getPromptMessage = (location: Location<unknown>) => {
    const { status } = this.state
    if (status !== 'initial' || location.pathname.includes('new-banner')) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  onBack = () => {
    const { history } = this.props
    this.setState({ status: 'regress' }, () => history.goBack())
  }

  render() {
    const { banner } = this.props
    const { status } = this.state
    if (!banner) {
      return <Fragment />
    }

    return (
      <>
        <Helmet>
          <title>Review Banner</title>
        </Helmet>
        <Prompt message={this.getPromptMessage} />

        <div className="banner-preview-page">
          <LoadingOverlay
            active={status === 'loading'}
            text="Saving..."
            spinner
            fadeSpeed={500}
          />
          <BannerInfoWithMap
            banner={banner}
            submitButton="Submit Banner"
            onSubmitButtonClicked={this.onSubmitBanner}
            goBackLabel="Review"
            onGoBack={this.onBack}
          />
        </div>
      </>
    )
  }
}

/* 

import { ReactComponent as SVGBackArrow } from '../../img/icons/back-arrow.svg'

          <div className="banner-preview-header">
            <button type="button" className="back-button" onClick={this.onBack}>
              <SVGBackArrow />
            </button>
            <h1>Review</h1>
          </div>


          <button
              type="button"
              className="positive-action-button"
              onClick={this.onSubmitBanner}
            >
              Submit Banner
            </button>



*/

export interface PreviewBannerProps extends RouteComponentProps {
  banner: Banner | undefined
  submitBanner: () => Promise<string>
  removePendingBanner: () => void
}

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
)(withRouter(PreviewBanner))
