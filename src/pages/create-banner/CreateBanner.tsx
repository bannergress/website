import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
// import { Layout, Row, Col } from 'antd'

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
  loadCountries as loadCountriesAction,
  Place,
} from '../../features/place'
// import PlaceList from '../../components/place-list'
// import BannerList from '../../components/banner-list'
// import BannerOrderChooser from '../../components/banner-order-chooser'

import './create-banner.less'
import { Mission } from '../../features/mission'

class CreateBanner extends React.Component<
  CreateBannerProps,
  CreateBannerState
> {
  constructor(props: CreateBannerProps) {
    super(props)
    this.state = {
      // eslint-disable-next-line react/no-unused-state
      addedMissions: [],
      // eslint-disable-next-line react/no-unused-state
      page: 0,
    }
  }

  // componentDidMount() {
  //   const { fetchCountries, fetchBanners } = this.props
  //   const { selectedDirection, selectedOrder } = this.state
  //   fetchCountries()
  //   fetchBanners(null, selectedOrder, selectedDirection, 0)
  // }

  // componentDidUpdate(prevProps: CreateBannerProps, prevState: CreateBannerState) {
  //   const { fetchBanners } = this.props
  //   const { selectedPlaces, selectedOrder, selectedDirection } = this.state
  //   if (selectedPlaces !== prevState.selectedPlaces) {
  //     fetchBanners(
  //       selectedPlaces[selectedPlaces.length - 1],
  //       selectedOrder,
  //       selectedDirection,
  //       0
  //     )
  //   }
  // }

  // onOrderSelected = (newOrder: BannerOrder) => {
  //   const { fetchBanners } = this.props
  //   const { selectedOrder, selectedDirection, selectedPlaces } = this.state
  //   let newDirection: BannerOrderDirection = 'ASC'
  //   if (newOrder === selectedOrder) {
  //     newDirection = selectedDirection === 'ASC' ? 'DESC' : 'ASC'
  //     this.setState({
  //       selectedDirection: newDirection,
  //     })
  //   } else {
  //     this.setState({
  //       selectedOrder: newOrder,
  //       selectedDirection: newDirection,
  //     })
  //   }
  //   fetchBanners(
  //     selectedPlaces[selectedPlaces.length - 1],
  //     newOrder,
  //     newDirection,
  //     0
  //   )
  // }

  // onPlaceSelected = (place: Place) => {
  //   const { fetchAdministrativeAreas } = this.props
  //   const { selectedPlaces } = this.state

  //   if (selectedPlaces.indexOf(place) < 0) {
  //     fetchAdministrativeAreas(place, selectedPlaces.length + 1).then(() =>
  //       this.setState({ selectedPlaces: [...selectedPlaces, place], page: 1 })
  //     )
  //   } else {
  //     this.setState({
  //       selectedPlaces: [
  //         ...selectedPlaces.slice(0, selectedPlaces.indexOf(place)),
  //       ],
  //       page: 0,
  //     })
  //   }
  // }

  // onLoadMoreBanners = () => {
  //   const { fetchBanners } = this.props
  //   const {
  //     selectedPlaces,
  //     selectedOrder,
  //     selectedDirection,
  //     page,
  //   } = this.state
  //   this.setState({ page: page + 1 })
  //   return fetchBanners(
  //     selectedPlaces[selectedPlaces.length - 1],
  //     selectedOrder,
  //     selectedDirection,
  //     page + 1
  //   )
  // }

  render() {
    // const { countries, banners, getAdministrativeAreas, hasMore } = this.props
    // let administrativeAreas: Array<Place> | null = null
    // let selectedPlace: Place | null = null
    //   if (selectedPlaces && selectedPlaces.length) {
    //     selectedPlace = selectedPlaces[selectedPlaces.length - 1]
    //     administrativeAreas = getAdministrativeAreas(selectedPlace)
    //   }
    //   return (
    //     <Fragment>
    //       <Row gutter={[16, 0]}>
    //         <Col span={4} className="places-list">
    //           <Layout>
    //             <PlaceList
    //               title={selectedPlace ? undefined : 'Countries'}
    //               places={administrativeAreas || countries}
    //               selectedPlaces={selectedPlaces}
    //               onSelectPlace={this.onPlaceSelected}
    //             />
    //           </Layout>
    //         </Col>
    //         <Col span={20}>
    //           <Row justify="start" className="banner-count">
    //             <h1>{selectedPlace?.numberOfBanners} Banners</h1>
    //           </Row>
    //           <Row justify="start" className="order-chooser">
    //             <BannerOrderChooser
    //               selectedOrder={selectedOrder}
    //               selectedDirection={selectedDirection}
    //               onOrderClicked={this.onOrderSelected}
    //             />
    //           </Row>
    //           <Row justify="start" className="banner-list">
    //             <BannerList
    //               banners={banners}
    //               hasMoreBanners={hasMore}
    //               loadMoreBanners={this.onLoadMoreBanners}
    //             />
    //           </Row>
    //         </Col>
    //       </Row>
    //     </Fragment>
    //   )
    return <Fragment>Banner</Fragment>
  }
}

export interface CreateBannerProps extends RouteComponentProps {
  banners: Array<Banner>
  countries: Array<Place>
  hasMore: Boolean
  getAdministrativeAreas: (place: Place) => Array<Place>
  fetchCountries: () => Promise<void>
  fetchAdministrativeAreas: (place: Place, level: number) => Promise<void>
  fetchBanners: (
    country: Place | null,
    order: BannerOrder,
    orderDirection: BannerOrderDirection,
    page: number
  ) => Promise<void>
}

interface CreateBannerState {
  addedMissions: Array<Mission>
  page: number
}

const mapStateToProps = (state: RootState) => ({
  countries: getCountries(state),
  banners: getBrowsedBanners(state),
  getAdministrativeAreas: (place: Place) =>
    getAdministrativeAreasSelector(state, place),
  hasMore: getHasMoreBrowsedBanners(state),
})

const mapDispatchToProps = {
  fetchCountries: loadCountriesAction,
  fetchBanners: loadBrowsedBannersAction,
  fetchAdministrativeAreas: loadAdministrativeAreasAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateBanner))
