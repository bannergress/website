import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Divider } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getSearchBanners,
  getHasMoreSearchBanners,
  loadSearchBanners as loadSearchBannersAction,
} from '../../features/banner'
import {
  Place,
  getSearchPlaces,
  getHasMoreSearchPlaces,
  loadSearchPlaces as loadSearchPlacesAction,
} from '../../features/place'
import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerList from '../../components/banner-list'
import PlaceListFlat from '../../components/place-list-flat'
import FooterMain from '../../components/footer-main'

import './search.less'

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
      searchTerm: '',
      pageBanners: 0,
      pagePlaces: 0,
      bannersStatus: 'initial',
      placesStatus: 'initial',
    }
  }

  static getDerivedStateFromProps(props: SearchProps, state: SearchState) {
    const { match } = props
    const { searchTerm } = state
    const newTerm = decodeURIComponent(match.params.term)

    if (searchTerm !== newTerm) {
      return {
        searchTerm: newTerm,
        pageBanners: 0,
        pagePlaces: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { selectedDirection, selectedOrder, searchTerm } = this.state

    this.doFetchBanners(searchTerm, selectedOrder, selectedDirection, 0)
    this.doFetchPlaces(searchTerm, 0)
  }

  componentDidUpdate(prevProps: SearchProps, prevState: SearchState) {
    const { searchTerm: prevSearchTerm } = prevState
    const { searchTerm, selectedOrder, selectedDirection } = this.state

    if (prevSearchTerm !== searchTerm) {
      this.doFetchBanners(searchTerm, selectedOrder, selectedDirection, 0)
      this.doFetchPlaces(searchTerm, 0)
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { selectedOrder, selectedDirection, searchTerm } = this.state
    let newDirection: BannerOrderDirection = 'ASC'
    if (newOrder === selectedOrder) {
      newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
      this.setState({
        selectedDirection: newDirection,
        pageBanners: 0,
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: newDirection,
        pageBanners: 0,
      })
    }
    this.doFetchBanners(searchTerm, newOrder, newDirection, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const {
      selectedOrder,
      selectedDirection,
      pageBanners,
      searchTerm,
    } = this.state
    this.setState({ pageBanners: pageBanners + 1 })
    return fetchBanners(
      searchTerm,
      selectedOrder,
      selectedDirection,
      pageBanners + 1
    )
  }

  onLoadMorePlaces = () => {
    const { fetchPlaces } = this.props
    const { pagePlaces, searchTerm } = this.state
    this.setState({ pagePlaces: pagePlaces + 1 })
    return fetchPlaces(searchTerm, pagePlaces + 1)
  }

  getPageTitle() {
    const { searchTerm } = this.state
    const title = `Search for ${searchTerm}`
    return title
  }

  async doFetchBanners(
    searchTerm: string,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) {
    const { fetchBanners } = this.props
    this.setState({ bannersStatus: 'loading' })
    await fetchBanners(searchTerm, order, orderDirection, pageBanners)
    this.setState({ bannersStatus: 'success' })
  }

  async doFetchPlaces(searchTerm: string, pagePlaces: number) {
    const { fetchPlaces } = this.props
    this.setState({ placesStatus: 'loading' })
    await fetchPlaces(searchTerm, pagePlaces)
    this.setState({ placesStatus: 'success' })
  }

  render() {
    const title: string = this.getPageTitle()
    const {
      bannersStatus,
      placesStatus,
      selectedDirection,
      selectedOrder,
    } = this.state
    const { banners, places, hasMoreBanners, hasMorePlaces } = this.props

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="search-page">
          <div className="search-content">
            <h1>{title}</h1>

            <h2>Banners</h2>

            <Layout>
              {bannersStatus === 'success' && (
                <>
                  {banners.length > 100000 && (
                    <>
                      <Row justify="start" className="order-chooser">
                        <BannerOrderChooser
                          selectedOrder={selectedOrder}
                          selectedDirection={selectedDirection}
                          onOrderClicked={this.onOrderSelected}
                        />
                      </Row>

                      <Row>
                        <BannerList
                          banners={banners}
                          hasMoreBanners={hasMoreBanners}
                          loadMoreBanners={this.onLoadMoreBanners}
                        />
                      </Row>
                    </>
                  )}

                  {banners.length === 0 && (
                    <>
                      <Row>No banners found</Row>
                    </>
                  )}
                </>
              )}

              {(bannersStatus === 'initial' || bannersStatus === 'loading') && (
                <>Loading...</>
              )}
            </Layout>

            <Divider type="horizontal" />

            <h2>Places</h2>

            <Layout>
              {placesStatus === 'success' && (
                <>
                  {places.length > 0 && (
                    <>
                      <Row>
                        <PlaceListFlat
                          places={places}
                          hasMorePlaces={hasMorePlaces}
                          loadMorePlaces={this.onLoadMorePlaces}
                        />
                      </Row>
                    </>
                  )}

                  {places.length === 0 && (
                    <>
                      <Row>No places found</Row>
                    </>
                  )}
                </>
              )}

              {(placesStatus === 'initial' || placesStatus === 'loading') && (
                <>Loading...</>
              )}
            </Layout>
          </div>
        </div>
        <FooterMain />
      </Fragment>
    )
  }
}

export interface SearchProps extends RouteComponentProps<{ term: string }> {
  banners: Array<Banner>
  places: Array<Place>
  hasMoreBanners: Boolean
  hasMorePlaces: Boolean
  fetchBanners: (
    searchTerm: string,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    pageBanners: number
  ) => Promise<void>
  fetchPlaces: (searchTerm: string, pagePlaces: number) => Promise<void>
}

interface SearchState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  searchTerm: string
  pageBanners: number
  pagePlaces: number
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
  placesStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getSearchBanners(state),
  places: getSearchPlaces(state),
  hasMoreBanners: getHasMoreSearchBanners(state),
  hasMorePlaces: getHasMoreSearchPlaces(state),
})

const mapDispatchToProps = {
  fetchBanners: loadSearchBannersAction,
  fetchPlaces: loadSearchPlacesAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Search))
