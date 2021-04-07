import { Dispatch } from 'redux'
import { LOAD_BANNER, LOAD_RECENT_BANNERS } from './actionTypes'
import { Banner, BannerActionTypes, Mission } from './types'

export const loadBannerAction = (id: number) => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const banner: Banner = {
    id,
    title: `Test banner ${id}`,
    numberOfMissions: 6,
    lenghtMeters: 3460,
    startLatitude: 49.032618,
    startLongitude: 10.971546,
    missions: [],
  }
  dispatch({
    type: LOAD_BANNER,
    payload: banner,
  })
}

const getMissions = (numberOfMissions: number) => {
  const missionList: Array<Mission> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    missionList.push({
      id: i.toString(),
      title: `test mission ${i}`,
      picture: '',
      steps: [],
    })
  }
  return missionList
}

const getBanner = (id: number, numberOfMissions: number) => ({
  title: `Banner #${id}`,
  numberOfMissions,
  id,
  lenghtMeters: 3460,
  startLatitude: 49.032618,
  startLongitude: 10.971546,
  missions: getMissions(numberOfMissions),
})

export const loadRecentBannersAction = () => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const bannerList: Array<Banner> = []
  bannerList.push(getBanner(1, 24))
  bannerList.push(getBanner(2, 6))
  bannerList.push(getBanner(3, 12))
  bannerList.push(getBanner(4, 36))
  bannerList.push(getBanner(5, 48))
  bannerList.push(getBanner(6, 3))
  bannerList.push(getBanner(7, 480))
  bannerList.push(getBanner(8, 36))
  bannerList.push(getBanner(9, 24))

  dispatch({
    type: LOAD_RECENT_BANNERS,
    payload: bannerList,
  })
}
