import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter, RouteComponentProps } from 'react-router-dom'
import { Layout, Row, Col } from 'antd'
import { Helmet } from 'react-helmet'

import { RootState } from '../../storeTypes'
import {
  Banner,
  BannerOrder,
  BannerOrderDirection,
  getBrowsedBanners,
  loadBrowsedBanners as loadBrowsedBannersAction,
  getHasMoreBrowsedBanners,
} from '../../features/banner'
import {
  getCountries,
  getAdministrativeAreas as getAdministrativeAreasSelector,
  loadAdministrativeAreas as loadAdministrativeAreasAction,
  loadPlace as loadPlaceAction,
  getPlace as getPlaceSelector,
  loadCountries as loadCountriesAction,
  Place,
  createMapUri,
} from '../../features/place'
import PlaceList from '../../components/place-list'
import BannerList from '../../components/banner-list'
import BannerOrderChooser from '../../components/banner-order-chooser'
import { ReactComponent as SVGMap } from '../../img/icons/map.svg'

import './browser.less'

class Browser extends React.Component<BrowserProps, BrowserState> {
  constructor(props: BrowserProps) {
    super(props)
    this.state = {
      selectedOrder: 'created',
      selectedDirection: 'DESC',
      page: 0,
      status: 'initial',
    }
  }

  componentDidMount() {
    const {
      fetchCountries,
      fetchAdministrativeAreas,
      fetchBanners,
      fetchPlace,
      match,
    } = this.props
    const { selectedDirection, selectedOrder } = this.state
    const { placeId } = match.params

    const promises: Array<Promise<any>> = []

    if (placeId) {
      promises.push(fetchAdministrativeAreas(placeId))
      promises.push(fetchPlace(placeId))
    } else {
      promises.push(fetchCountries())
    }

    Promise.all(promises)
      .then(() => this.setState({ status: 'success' }))
      .catch(() => this.setState({ status: 'error' }))

    fetchBanners(placeId, selectedOrder, selectedDirection, 0)
  }

  static getDerivedStateFromProps(props: BrowserProps, state: BrowserState) {
    const { match } = props
    const { placeId } = match.params

    return { ...state, selectedPlaceId: placeId }
  }

  componentDidUpdate(prevProps: BrowserProps) {
    const { fetchBanners, match } = this.props
    const { placeId } = match.params
    const { selectedOrder, selectedDirection } = this.state
    if (placeId !== prevProps.match.params.placeId) {
      fetchBanners(placeId, selectedOrder, selectedDirection, 0)
    }
  }

  onOrderSelected = (newOrder: BannerOrder) => {
    const { fetchBanners, match } = this.props
    const { placeId } = match.params
    const { selectedOrder, selectedDirection } = this.state

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
    fetchBanners(placeId, newOrder, newDirection, 0)
  }

  onPlaceSelected = async (place: Place) => {
    const {
      fetchAdministrativeAreas,
      fetchCountries,
      getAdministrativeAreas,
      countries,
      history,
    } = this.props
    const { selectedPlaceId } = this.state

    const parentPlaceIdOfSelectedPlace = place?.parentPlaceId
    let newPlaceId: string | undefined

    if (parentPlaceIdOfSelectedPlace === selectedPlaceId) {
      newPlaceId = place.id
      // When going down, we always want to reload the list
      await fetchAdministrativeAreas(newPlaceId)
    } else {
      newPlaceId = place.parentPlaceId

      // When going up, only reload the list when missing
      if (newPlaceId) {
        if ((getAdministrativeAreas(newPlaceId) ?? []).length === 0) {
          await fetchAdministrativeAreas(newPlaceId)
        }
      } else if (countries.length === 0) {
        await fetchCountries()
      }
    }

    this.setState({
      selectedPlaceId: newPlaceId,
      page: 0,
    })
    history.push(`/browse/${newPlaceId || ''}`)
  }

  onLoadMoreBanners = () => {
    const { fetchBanners, match } = this.props
    const { placeId } = match.params
    const { selectedOrder, selectedDirection, page } = this.state
    this.setState({ page: page + 1 })
    return fetchBanners(placeId, selectedOrder, selectedDirection, page + 1)
  }

  render() {
    const {
      countries,
      banners,
      getAdministrativeAreas,
      getPlace,
      hasMore,
    } = this.props
    const {
      selectedDirection,
      selectedOrder,
      selectedPlaceId,
      status,
    } = this.state

    if (status === 'initial') {
      return <Fragment>Loading content...</Fragment>
    }

    let administrativeAreas: Array<Place> | null = null
    let selectedPlace: Place | null = null
    let selectedPlaces: Place[] = []

    if (selectedPlaceId) {
      selectedPlace = getPlace(selectedPlaceId)

      if (selectedPlace) {
        administrativeAreas = getAdministrativeAreas(selectedPlaceId) || []
        selectedPlaces = [selectedPlace]

        // Get parent path
        let currentParentPlace: Place | null = selectedPlace
        while (currentParentPlace?.parentPlaceId) {
          currentParentPlace = getPlace(currentParentPlace?.parentPlaceId)

          if (currentParentPlace) {
            selectedPlaces.push(currentParentPlace)
          }
        }
        selectedPlaces.reverse()
      }
    }

    const pageTitle = selectedPlace
      ? selectedPlace.formattedAddress
      : 'Countries'

    return (
      <Fragment>
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <Row>
          <Col span={4} className="places-list">
            <Layout>
              <PlaceList
                title={selectedPlace ? undefined : 'Countries'}
                order="numberOfBanners"
                places={administrativeAreas || countries}
                selectedPlaces={selectedPlaces}
                onSelectPlace={this.onPlaceSelected}
              />
            </Layout>
          </Col>
          <Col span={20}>
            <Row justify="start" className="banner-count">
              <h1>
                {selectedPlace?.numberOfBanners} Banners
                {selectedPlace && (
                  <>
                    &nbsp;in {selectedPlace.longName}
                    <Link to={createMapUri(selectedPlace)}>
                      <SVGMap className="browser-icon" title="Map" />
                    </Link>
                  </>
                )}
              </h1>
            </Row>
            <Row justify="start" className="order-chooser">
              <BannerOrderChooser
                selectedOrder={selectedOrder}
                selectedDirection={selectedDirection}
                onOrderClicked={this.onOrderSelected}
              />
            </Row>
            <Row justify="start" className="banner-list">
              <BannerList
                banners={banners}
                hasMoreBanners={hasMore}
                loadMoreBanners={this.onLoadMoreBanners}
              />
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export interface BrowserProps extends RouteComponentProps<{ placeId: string }> {
  banners: Array<Banner>
  countries: Array<Place>
  hasMore: Boolean
  getAdministrativeAreas: (parentPlaceId: string) => Array<Place>
  getPlace: (placeID: string) => Place | null
  fetchCountries: () => Promise<void>
  fetchAdministrativeAreas: (parentPlaceId: string) => Promise<void>
  fetchPlace: (placeID: string) => Promise<void>
  fetchBanners: (
    placeId: string | null,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    page: number
  ) => Promise<void>
}

interface BrowserState {
  selectedOrder: BannerOrder
  selectedDirection: BannerOrderDirection
  selectedPlaceId?: string
  page: number
  status: 'initial' | 'success' | 'loading' | 'error'
}

const mapStateToProps = (state: RootState) => ({
  countries: getCountries(state),
  banners: getBrowsedBanners(state),
  getAdministrativeAreas: (parentPlaceId: string) =>
    getAdministrativeAreasSelector(state, parentPlaceId),
  getPlace: (placeId: string) => getPlaceSelector(state, placeId),
  hasMore: getHasMoreBrowsedBanners(state),
})

const mapDispatchToProps = {
  fetchCountries: loadCountriesAction,
  fetchBanners: loadBrowsedBannersAction,
  fetchAdministrativeAreas: loadAdministrativeAreasAction,
  fetchPlace: loadPlaceAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Browser))
