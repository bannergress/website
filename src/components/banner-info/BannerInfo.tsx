import React, { Fragment } from 'react'

import './Banner-info.less'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getBanner, loadBanner } from '../../features/banner'
import { RootState } from '../../store'

import BannerCard from '../banner-card'

interface BannerProps {
  banner: Function
  fetchBanner: Function
}

export class BannerInfo extends React.Component<BannerProps, {}> {
  params = useParams<{ id: string }>()

  componentDidMount() {
    const { fetchBanner } = this.props
    fetchBanner(this.params.id)
  }

  render() {
    const { banner } = this.props
    return (
      <Fragment>
        <BannerCard banner={banner(this.params.id)} />
      </Fragment>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  banner: (id: string) => getBanner(state.banner, id)
})

const mapDispatchToProps = {
  fetchBanner: (id: string) => loadBanner(id)
}

export default connect(mapStateToProps, mapDispatchToProps)(BannerInfo)
