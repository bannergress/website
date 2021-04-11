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
import BannerOrderChooser from '../../components/banner-order-chooser'

import './browser.less'

class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
    }
  }

  componentDidMount() {
    const { fetchCountries } = this.props
    fetchCountries()
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { selectedOrder, selectedDirection } = this.state
    if (newOrder === selectedOrder) {
      this.setState({
        selectedDirection: selectedDirection === 'ASC' ? 'DESC' : 'ASC',
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: 'ASC',
      })
    }
  }

  render() {
    const { countries, banners } = this.props
    const { selectedDirection, selectedOrder } = this.state

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
        <Row justify="start" className="banner-count">
          <h1>534 Banners</h1>
        </Row>
        <Row justify="start" className="order-chooser">
          <BannerOrderChooser
            selectedOrder={selectedOrder}
            selectedDirection={selectedDirection}
            onOrderClicked={this.onOrderSelected}
          />
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
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
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
