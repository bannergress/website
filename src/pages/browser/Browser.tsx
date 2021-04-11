import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, Row } from 'antd'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getBrowsedBanners,
  loadBrowsedBanners as loadBrowsedBannersAction,
} from '../../features/banner'
import {
  getCountries,
  loadCountries as loadCountriesAction,
  Place,
} from '../../features/place'
import PlaceList from '../../components/place-list'
import BannerList from '../../components/banner-list'

import './browser.less'

class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  componentDidMount() {
    const { fetchCountries } = this.props
    fetchCountries()
  }

  onExpand = () => {
    const { expanded } = this.state
    this.setState({ expanded: !expanded })
  }

  render() {
    const { countries, banners } = this.props
    // const { expanded } = this.state

    return (
      <Fragment>
        <Row justify="center" className="places-list">
          <Layout>
            <PlaceList
              title="Countries"
              places={countries}
              onSelectPlace={() => {}}
            />
          </Layout>
        </Row>
        <Row justify="center" className="banner-list">
          <BannerList banners={banners} />
        </Row>
      </Fragment>
    )
  }
}

export interface BrowserProps extends RouteComponentProps {
  banners: Array<Banner>
  countries: Array<Place>
  fetchCountries: () => Promise<void>
  fetchBanners: (
    country: Place,
    order: BannerOrder,
    orderDirection: BannerOrderDirection
  ) => Promise<void>
}

interface BrowserState {
  expanded: boolean
}

const mapStateToProps = (state: RootState) => ({
  countries: getCountries(state),
  banners: getBrowsedBanners(state),
})

const mapDispatchToProps = {
  fetchCountries: loadCountriesAction,
  fetchBanners: loadBrowsedBannersAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Browser))
