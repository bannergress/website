import React, { Fragment } from 'react'

import './Banner-info.less'
import { connect } from 'react-redux'
import { match as Match } from 'react-router-dom'
import {
  getBanner as getBannerSelector,
  loadBanner,
} from '../../features/banner'
import { RootState } from '../../store'

import BannerCard from '../banner-card'

interface BannerProps {
  getBanner: Function
  fetchBanner: Function
  match: Match<{ id: string }>
}

export class BannerInfo extends React.Component<BannerProps, {}> {
  componentDidMount() {
    const { fetchBanner, match } = this.props
    fetchBanner(match.params.id)
  }

  render() {
    const { getBanner, match } = this.props
    const banner = getBanner(match.params.id)
    if (banner) {
      return (
        <Fragment>
          <BannerCard banner={banner} />
        </Fragment>
      )
    }
    return <Fragment>loading</Fragment>
  }
}

const mapStateToProps = (state: RootState) => ({
  getBanner: (id: string) => getBannerSelector(state.banner, id),
})

const mapDispatchToProps = {
  fetchBanner: (id: string) => loadBanner(id),
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerInfo)
