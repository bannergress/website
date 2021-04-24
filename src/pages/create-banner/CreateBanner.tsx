import React, { Fragment } from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Row, Col, Input, Button } from 'antd'
import _ from 'underscore'

import { RootState } from '../../storeTypes'
import './create-banner.less'
import {
  getHasMoreSearchedMissions,
  getMissions,
  Mission,
  searchMissions as searchMissionsAction,
} from '../../features/mission'
import SearchMissionList from '../../components/search-mission-list'
import BannerImage from '../../components/banner-image'

class CreateBanner extends React.Component<
  CreateBannerProps,
  CreateBannerState
> {
  private timer: NodeJS.Timeout | null = null

  constructor(props: CreateBannerProps) {
    super(props)
    this.state = {
      addedMissions: [],
      page: 0,
      searchText: null,
      location: null,
      bannerTitle: null,
      bannerDescription: null,
    }
  }

  // componentDidMount() {
  //   const { fetchCountries, fetchBanners } = this.props
  //   const { selectedDirection, selectedOrder } = this.state
  //   fetchCountries()
  //   fetchBanners(null, selectedOrder, selectedDirection, 0)
  // }

  componentDidUpdate(
    _prevProps: CreateBannerProps,
    prevState: CreateBannerState
  ) {
    const { searchText } = this.state
    if (searchText !== prevState.searchText) {
      this.handleSearch()
    }
  }

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

  handleSearch = () => {
    // Clears running timer and starts a new one each time the user types
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.searchMissions()
    }, 1000)
  }

  searchMissions = () => {
    const { fetchMissions } = this.props
    const { searchText, location } = this.state
    if (searchText) {
      this.setState({ page: 0 })
      fetchMissions(location, searchText, 0)
    }
  }

  onInputChange = (
    val: string,
    inputName: 'searchText' | 'location' | 'bannerTitle' | 'bannerDescription'
  ) => {
    const newState: Pick<CreateBannerState, any> = { [inputName]: val }
    this.setState(newState)
  }

  onLoadMoreMissions = (): Promise<void> => {
    const { fetchMissions } = this.props
    const { location, searchText, page } = this.state
    if (!searchText) {
      throw new Error('no missions to search')
    }
    this.setState({ page: page + 1 })
    return fetchMissions(location, searchText, page)
  }

  onAddMission = (mission: Mission) => {
    this.setState((old) => ({
      addedMissions: old.addedMissions.concat([mission]),
    }))
  }

  onManageMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.setState({ addedMissions: _(addedMissions).without(mission) })
  }

  render() {
    const { missions, hasMore } = this.props
    const { addedMissions, bannerTitle, bannerDescription } = this.state

    const unusedMissions = _.filter(
      missions,
      (m) => !_.some(addedMissions, (a) => a.id === m.id)
    )

    return (
      <Fragment>
        <h1>New Banner</h1>
        <Row gutter={[16, 0]}>
          <Col span={8} className="add-missions-col">
            <Row justify="start">
              <span className="number">1</span> Add Missions
            </Row>
            <Row>
              Location (Optional)
              <Input
                placeholder="Start typing..."
                onChange={(e) => this.onInputChange(e.target.value, 'location')}
              />
            </Row>
            <Row>
              Search for missions
              <span>You can search by mission name or author</span>
              <Input
                placeholder="New Banner"
                onChange={(e) =>
                  this.onInputChange(e.target.value, 'searchText')
                }
              />
            </Row>
            <Row style={{ maxHeight: 500, overflowY: 'scroll' }}>
              <SearchMissionList
                missions={unusedMissions}
                hasMoreMissions={hasMore}
                loadMoreMissions={this.onLoadMoreMissions}
                inverse={false}
                onSelectMission={this.onAddMission}
              />
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="start">
              <span className="number">2</span> Arrange
            </Row>
            <Row style={{ maxHeight: 800, overflowY: 'scroll' }}>
              <SearchMissionList
                missions={addedMissions}
                hasMoreMissions={false}
                inverse
                onSelectMission={this.onManageMission}
              />
            </Row>
          </Col>
          <Col span={8}>
            <Row justify="start">
              <span className="number">3</span> Information
            </Row>
            <Row>
              Banner Title
              <Input
                placeholder="Start typing..."
                onChange={(e) =>
                  this.onInputChange(e.target.value, 'bannerTitle')
                }
              />
            </Row>
            <Row>
              Description
              <Input.TextArea
                placeholder="Start typing..."
                onChange={(e) =>
                  this.onInputChange(e.target.value, 'bannerDescription')
                }
              />
            </Row>
            <Row>Advanced Options</Row>
            <Row>
              Preview
              <BannerImage missions={addedMissions} />
            </Row>
            <Row>
              <Button
                disabled={
                  !addedMissions.length || !bannerTitle || !bannerDescription
                }
              >
                Review
              </Button>
            </Row>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export interface CreateBannerProps extends RouteComponentProps {
  missions: Array<Mission>
  hasMore: Boolean
  fetchMissions: (
    location: string | null,
    query: string,
    page: number
  ) => Promise<void>
}

interface CreateBannerState {
  addedMissions: Array<Mission>
  page: number
  searchText: string | null
  location: string | null
  bannerTitle: string | null
  bannerDescription: string | null
}

const mapStateToProps = (state: RootState) => ({
  missions: getMissions(state),
  hasMore: getHasMoreSearchedMissions(state),
})

const mapDispatchToProps = {
  fetchMissions: searchMissionsAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateBanner))
