import React from 'react'
import { connect } from 'react-redux'
import { withRouter, RouteComponentProps, Prompt } from 'react-router-dom'
import { Input } from 'antd'
import _ from 'underscore'
import Scrollbars from 'react-custom-scrollbars'

import { RootState } from '../../storeTypes'
import './create-banner.less'
import {
  getHasMoreSearchedMissions,
  getMissions,
  mapMissions,
  Mission,
  searchMissions as searchMissionsAction,
  resetSearchMissions as resetSearchMissionsAction,
} from '../../features/mission'
import {
  Banner,
  createBanner as createBannerAction,
  getCreatedBanner,
  NumDictionary,
} from '../../features/banner'
import SearchMissionList from '../../components/search-mission-list'
import BannerImage from '../../components/banner-image'
import { extract } from '../../features/banner/naming'

import { ReactComponent as SVGRightArrow } from '../../img/icons/right_arrow.svg'
import { ReactComponent as SVGCross } from '../../img/icons/cross.svg'

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
      bannerTitle: undefined,
      bannerDescription: undefined,
      bannerTitleChanged: false,
      bannerDescriptionChanged: false,
      loading: false,
    }
  }

  componentDidMount() {
    const { previousBanner } = this.props
    if (previousBanner) {
      const { title, description, missions } = previousBanner
      const addedMissions = mapMissions(missions, (m) => m)
      this.setState({
        bannerTitle: title,
        bannerDescription: description,
        addedMissions,
      })
    }
  }

  componentDidUpdate(
    _prevProps: CreateBannerProps,
    prevState: CreateBannerState
  ) {
    const { searchText } = this.state
    if (searchText !== prevState.searchText) {
      this.handleSearch()
    }
  }

  componentWillUnmount() {
    const { resetSearchMissions } = this.props
    resetSearchMissions()
  }

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
    if (searchText && searchText.length > 2) {
      this.setState({ page: 0 })
      fetchMissions(location, searchText, 0).catch()
    }
  }

  onInputChange = (
    val: string,
    inputName: 'searchText' | 'location' | 'bannerTitle' | 'bannerDescription'
  ) => {
    const newState: Pick<CreateBannerState, any> = { [inputName]: val }
    if (inputName === 'bannerTitle') {
      if (val) {
        newState.bannerTitleChanged = true
      } else {
        newState.bannerTitleChanged = false
      }
    }
    if (inputName === 'bannerDescription') {
      if (val) {
        newState.bannerDescriptionChanged = true
      } else {
        newState.bannerDescriptionChanged = false
      }
    }
    this.setState(newState)
  }

  onLoadMoreMissions = (): Promise<void> => {
    const { fetchMissions } = this.props
    const { location, searchText, page } = this.state
    if (!searchText) {
      throw new Error('no missions to search')
    }
    this.setState({ page: page + 1 })
    return fetchMissions(location, searchText, page + 1)
  }

  onMissionsChanged = (missions: Array<Mission>) => {
    const { bannerTitleChanged, bannerDescriptionChanged } = this.state
    const result = extract(missions.map((m) => m.title))
    const addedMissions = _(result.results)
      .chain()
      .map((m, index) => ({ ...m, mission: missions[index] }))
      .sortBy((m) => m.missionMarker?.parsed)
      .map((m) => m.mission)
      .value()
    const newState: Pick<CreateBannerState, any> = { addedMissions }
    if (!bannerTitleChanged) {
      newState.bannerTitle = result.title
    }
    if (!bannerDescriptionChanged) {
      newState.bannerDescription = addedMissions[0].description
    }
    this.setState(newState)
  }

  onAddMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.onMissionsChanged([...addedMissions, mission])
  }

  onManageMission = (mission: Mission) => {
    const { addedMissions } = this.state
    this.setState({ addedMissions: _(addedMissions).without(mission) })
  }

  onCreateBanner = () => {
    const { createBanner, history } = this.props
    const { addedMissions, bannerTitle, bannerDescription } = this.state
    const missions = addedMissions.reduce<NumDictionary<Mission>>(
      (prev, curr, index) => ({
        ...prev,
        [index]: curr,
      }),
      {}
    )
    this.setState({ loading: true })
    createBanner({
      title: bannerTitle!,
      description: bannerDescription,
      missions,
      numberOfMissions: addedMissions.length,
      width: 6,
      type: 'sequential',
    })
      .then(() => {
        history.push('/preview-banner')
      })
      .catch(() => this.setState({ loading: false }))
  }

  getPromptMessage = () => {
    const { loading, addedMissions } = this.state
    if (loading || addedMissions.length === 0) {
      return true
    }
    return 'Are you sure you want to leave and discard this banner?'
  }

  render() {
    const { missions, hasMore } = this.props
    const {
      addedMissions,
      bannerTitle,
      bannerDescription,
      searchText,
      loading,
    } = this.state

    const unusedMissions = _.filter(
      missions,
      (m) => !_.some(addedMissions, (a) => a.id === m.id)
    )

    return (
      <div className="create-banner">
        <Prompt message={this.getPromptMessage} />
        {loading && <>Loading...</>}
        <h1>New Banner</h1>
        <div className="create-banner-steps">
          <div>
            <h1>① Add Missions</h1>
            <h3>Location (Optional)</h3>
            <Input
              placeholder="Start typing..."
              onChange={(e) => this.onInputChange(e.target.value, 'location')}
            />
            <h3>Search for missions</h3>
            <span>You can search by mission name or author</span>
            <Input
              placeholder="New Banner"
              onChange={(e) => this.onInputChange(e.target.value, 'searchText')}
            />
            <h3>Search results</h3>
            <SearchMissionList
              missions={unusedMissions}
              hasMoreMissions={hasMore}
              icon={<SVGRightArrow />}
              initial={!!searchText}
              loadMoreMissions={this.onLoadMoreMissions}
              onSelectMission={this.onAddMission}
            />
          </div>
          <div>
            <h1>② Arrange</h1>
            <SearchMissionList
              missions={addedMissions}
              hasMoreMissions={false}
              icon={<SVGCross />}
              onSelectMission={this.onManageMission}
            />
          </div>
          <div>
            <h1>③ Information</h1>
            <h3>Banner Title</h3>
            <Input
              placeholder="Start typing..."
              value={bannerTitle}
              onChange={(e) =>
                this.onInputChange(e.target.value, 'bannerTitle')
              }
            />
            <h3>Description</h3>
            <Input.TextArea
              placeholder="Start typing..."
              value={bannerDescription}
              onChange={(e) =>
                this.onInputChange(e.target.value, 'bannerDescription')
              }
            />
            <h3>Advanced Options</h3>
            <h3>Preview</h3>
            <div className="create-banner-preview">
              <Scrollbars autoHeight autoHeightMin={100} autoHeightMax={284}>
                <BannerImage missions={addedMissions} />
              </Scrollbars>
            </div>
            <button
              type="button"
              onClick={this.onCreateBanner}
              className="positive-action-button"
              disabled={addedMissions.length < 2 || !bannerTitle}
            >
              Review
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export interface CreateBannerProps extends RouteComponentProps {
  previousBanner: Banner | undefined
  missions: Array<Mission>
  hasMore: Boolean
  fetchMissions: (
    location: string | null,
    query: string,
    page: number
  ) => Promise<void>
  createBanner: (banner: Partial<Banner>) => Promise<void>
  resetSearchMissions: () => void
}

interface CreateBannerState {
  addedMissions: Array<Mission>
  page: number
  searchText: string | null
  location: string | null
  bannerTitle: string | undefined
  bannerDescription: string | undefined
  bannerTitleChanged: boolean
  bannerDescriptionChanged: boolean
  loading: boolean
}

const mapStateToProps = (state: RootState) => ({
  previousBanner: getCreatedBanner(state),
  missions: getMissions(state),
  hasMore: getHasMoreSearchedMissions(state),
})

const mapDispatchToProps = {
  fetchMissions: searchMissionsAction,
  createBanner: createBannerAction,
  resetSearchMissions: resetSearchMissionsAction,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CreateBanner))
