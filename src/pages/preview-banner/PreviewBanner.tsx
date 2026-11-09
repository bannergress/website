import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Beforeunload } from 'react-beforeunload'
import { PageTitle } from '../../components/page-title/PageTitle'
import { withTranslation, WithTranslationProps } from 'react-i18next'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getCreatedBanner,
  submitBanner as submitBannerAction,
  removePendingBanner as removePendingBannerAction,
  createBanner as createBannerAction,
} from '../../features/banner'
import { mapMissions, type Mission } from '../../features/mission'
import { CollectionOrderOptimizer } from '../../components/collection-order-optimizer/CollectionOrderOptimizer'
import LoadingOverlay from '../../components/loading-overlay'
import { BannerInfoWithMap } from '../../components/banner-info-with-map'
import { NavigationPrompt } from '../../components/navigation-prompt'
import { withRouter, RouteComponentProps } from '../../hocs/withRouter'

import './PreviewBanner.scss'

const PreviewCollectionOptimizer = ({
  banner,
  ...props
}: {
  banner: Banner
} & Omit<
  React.ComponentProps<typeof CollectionOrderOptimizer>,
  'missions'
>) => {
  const missions = React.useMemo(
    () => mapMissions(banner.missions, (mission) => mission),
    [banner.missions]
  )
  return <CollectionOrderOptimizer {...props} missions={missions} />
}

export class PreviewBanner extends React.Component<
  PreviewBannerProps,
  PreviewBannerState
> {
  constructor(props: PreviewBannerProps) {
    super(props)
    this.state = {
      status: 'initial',
      optimizing: false,
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
    if (this.state.optimizing || this.state.status === 'loading') return
    const { submitBanner, history } = this.props
    this.setState({ status: 'loading' })
    submitBanner()
      .then((bannerId) => {
        history.push(`/banner/${bannerId}`)
      })
      .catch(() => this.setState({ status: 'error' }))
  }

  onOptimizingChanged = (optimizing: boolean) => this.setState({ optimizing })

  onOrderMissions = async (missions: Mission[], signal: AbortSignal) => {
    const { banner, createBanner } = this.props
    if (!banner || signal.aborted) return
    await createBanner(
      {
        ...banner,
        missions: Object.fromEntries(
          missions.map((mission, index) => [index, mission])
        ),
      },
      signal
    )
  }

  getPromptMessage = (pathname?: string) => {
    const { status } = this.state
    if (
      status !== 'initial' ||
      pathname?.includes('new-banner') ||
      pathname?.includes('edit-banner')
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
    const { status, optimizing } = this.state
    if (!banner) {
      return <Fragment />
    }

    return (
      <>
        <PageTitle title={i18n?.t('banners.review.title')} />
        <NavigationPrompt getMessage={this.getPromptMessage} />
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
            submitDisabled={status === 'loading' || optimizing}
            showMissionOrder={banner.type === 'anyOrder'}
            mapControls={
              banner.type === 'anyOrder' ? (
                <PreviewCollectionOptimizer
                  banner={banner}
                  disabled={status === 'loading'}
                  onOrdered={this.onOrderMissions}
                  onRunningChange={this.onOptimizingChanged}
                />
              ) : undefined
            }
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
  createBanner: (banner: Partial<Banner>, signal?: AbortSignal) => Promise<void>
} & RouteComponentProps &
  WithTranslationProps

interface PreviewBannerState {
  status: 'initial' | 'loading' | 'regress' | 'error'
  optimizing: boolean
}

const mapStateToProps = (state: RootState) => ({
  banner: getCreatedBanner(state),
})

const mapDispatchToProps = {
  submitBanner: submitBannerAction,
  removePendingBanner: removePendingBannerAction,
  createBanner: createBannerAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(withTranslation()(PreviewBanner)))
