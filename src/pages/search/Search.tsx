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
  loadSearchPlaces as loadSearchPlacesAction,
} from '../../features/place'
import BannerOrderChooser from '../../components/banner-order-chooser'
import BannerList from '../../components/banner-list'
import FooterMain from '../../components/footer-main'

import './search.less'

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
      searchTerm: '',
      page: 0,
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
        page: 0,
      }
    }

    return null
  }

  componentDidMount() {
    const { selectedDirection, selectedOrder, searchTerm } = this.state

    this.doFetchBanners(searchTerm, selectedOrder, selectedDirection, 0)
    this.doFetchPlaces(searchTerm)
  }

  componentDidUpdate(prevProps: SearchProps, prevState: SearchState) {
    const { searchTerm: prevSearchTerm } = prevState
    const { searchTerm, selectedOrder, selectedDirection } = this.state

    if (prevSearchTerm !== searchTerm) {
      this.doFetchBanners(searchTerm, selectedOrder, selectedDirection, 0)
      this.doFetchPlaces(searchTerm)
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { selectedOrder, selectedDirection, searchTerm } = this.state
    let newDirection: BannerOrderDirection = 'ASC'
    if (newOrder === selectedOrder) {
      newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
      this.setState({
        selectedDirection: newDirection,
        page: 0,
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: newDirection,
        page: 0,
      })
    }
    this.doFetchBanners(searchTerm, newOrder, newDirection, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const { selectedOrder, selectedDirection, page, searchTerm } = this.state
    this.setState({ page: page + 1 })
    return fetchBanners(searchTerm, selectedOrder, selectedDirection, page + 1)
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
    page: number
  ) {
    const { fetchBanners } = this.props
    this.setState({ bannersStatus: 'loading' })
    await fetchBanners(searchTerm, order, orderDirection, page)
    this.setState({ bannersStatus: 'success' })
  }

  async doFetchPlaces(searchTerm: string) {
    const { fetchPlaces } = this.props
    this.setState({ placesStatus: 'loading' })
    await fetchPlaces(searchTerm)
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
    const { banners, hasMoreBanners } = this.props

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <div className="search-page">
          <div className="search-content">
            <h1>{title}</h1>

            <h2>Places</h2>
            <div>
              {/* TODO Show search results for location if found */}
              {(placesStatus === 'initial' || placesStatus === 'loading') && (
                <>Loading...</>
              )}
            </div>

            <Divider type="horizontal" />

            <h2>Banners</h2>

            <Layout>
              {bannersStatus === 'success' && (
                <>
                  {banners.length > 0 && (
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
  fetchBanners: (
    searchTerm: string,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    page: number
  ) => Promise<void>
  fetchPlaces: (searchTerm: string) => Promise<void>
}

interface SearchState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  searchTerm: string
  page: number
  bannersStatus: 'initial' | 'success' | 'loading' | 'error'
  placesStatus: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getSearchBanners(state),
  places: getSearchPlaces(state),
  hasMoreBanners: getHasMoreSearchBanners(state),
})

const mapDispatchToProps = {
  fetchBanners: loadSearchBannersAction,
  fetchPlaces: loadSearchPlacesAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Search))
