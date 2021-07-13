import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  getBanner as getBannerSelector,
  loadBanner,
} from '../../features/banner'
import LoadingOverlay from '../../components/loading-overlay'
import { BannerInfoWithMap } from '../../components/banner-info-with-map'

import './banner-info.less'

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
    const { getBanner, match } = this.props
    const { status } = this.state
    const banner = getBanner(match.params.id)

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
      return <LoadingOverlay active spinner text="Loading..." fadeSpeed={500} />
    }
    return <>No banners found with that id</>
  }
}

export interface BannerInfoProps extends RouteComponentProps<{ id: string }> {
  getBanner: (id: string) => Banner | undefined
  fetchBanner: (id: string) => Promise<void>
}

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
)(withRouter(BannerInfo))
