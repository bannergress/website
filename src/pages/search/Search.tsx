import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Row, Layout, Divider } from 'antd'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import FooterMain from '../../components/footer-main'
import BannerList from '../../components/banner-list'
import BannerOrderChooser from '../../components/banner-order-chooser'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getSearchBanners,
  getHasMoreSearchBanners,
} from '../../features/banner'
import { RootState } from '../../storeTypes'
import { loadSearchBannersAction } from '../../features/banner/actions'

class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
      page: 0,
      // TODO status: 'initial',
    }
  }

  componentDidMount() {
    const { fetchBanners } = this.props
    const { selectedDirection, selectedOrder } = this.state

    fetchBanners(this.getSearchTerm(), selectedOrder, selectedDirection, 0)
  }

  componentDidUpdate(prevProps: SearchProps) {
    const { fetchBanners, match } = this.props
    const { match: prevMatch } = prevProps
    const { selectedOrder, selectedDirection } = this.state

    if (prevMatch.params.term !== match.params.term)
      fetchBanners(this.getSearchTerm(), selectedOrder, selectedDirection, 0)
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { fetchBanners } = this.props
    const { selectedOrder, selectedDirection } = this.state
    let newDirection: BannerOrderDirection = 'ASC'
    if (newOrder === selectedOrder) {
      newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
      this.setState({
        selectedDirection: newDirection,
      })
    } else {
      this.setState({
        selectedOrder: newOrder,
        selectedDirection: newDirection,
      })
    }
    fetchBanners(this.getSearchTerm(), newOrder, newDirection, 0)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners } = this.props
    const { selectedOrder, selectedDirection, page } = this.state
    this.setState({ page: page + 1 })
    return fetchBanners(
      this.getSearchTerm(),
      selectedOrder,
      selectedDirection,
      page + 1
    )
  }

  getPageTitle() {
    const { match } = this.props
    const title = `Search for ${decodeURIComponent(match.params.term)}`
    return title
  }

  getSearchTerm() {
    const { match } = this.props
    const term = decodeURIComponent(match.params.term)
    return term
  }

  render() {
    const title: string = this.getPageTitle()
    document.title = title

    const { selectedDirection, selectedOrder } = this.state
    const { banners, hasMore } = this.props

    return (
      <Fragment>
        <Helmet>
          <title>{title}</title>
        </Helmet>
        <Layout>
          <Row>
            <h2>{title}</h2>
          </Row>

          <Row>{/* TODO Show search results for location if found */}</Row>

          <Row>
            <Divider type="horizontal" />
          </Row>

          {banners.length > 0 && (
            <>
              <Row>
                <BannerOrderChooser
                  selectedOrder={selectedOrder}
                  selectedDirection={selectedDirection}
                  onOrderClicked={this.onOrderSelected}
                />
              </Row>

              <Row>
                <BannerList
                  banners={banners}
                  hasMoreBanners={hasMore}
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
        </Layout>

        <FooterMain />
      </Fragment>
    )
  }
}

export interface SearchProps extends RouteComponentProps<{ term: string }> {
  banners: Array<Banner>
  hasMore: Boolean
  fetchBanners: (
    searchTerm: string,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    page: number
  ) => Promise<void>
}

interface SearchState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  page: number
  // TODO status: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  banners: getSearchBanners(state),
  hasMore: getHasMoreSearchBanners(state),
})

const mapDispatchToProps = {
  fetchBanners: loadSearchBannersAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Search))
