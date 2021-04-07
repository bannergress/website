import { Dispatch } from 'redux'
import { LOAD_BANNER, LOAD_RECENT_BANNERS } from './actionTypes'
import { Banner, BannerActionTypes, Dictionary, Mission } from './types'

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

const getRandomInt = (max: number, multiplier: number, min: number) =>
  Math.floor(Math.random() * (max + 1)) * multiplier + min

const getMissions = (numberOfMissions: number) => {
  const missionList: Dictionary<Mission> = {}
  for (let i = numberOfMissions - 1; i >= 0; i -= 1) {
    const imgUrl = `badges/mission-set-${(i % 18) + 1}.png`
    missionList[i] = {
      id: i.toString(),
      title: `test mission ${i}`,
      picture: imgUrl,
      steps: [],
    }
  }
  return missionList
}

const getBanner = (id: number, numberOfMissions: number) => ({
  title: `Banner #${id}`,
  numberOfMissions,
  id,
  lenghtMeters: getRandomInt(5000, 1, 100),
  startLatitude: 49.032618,
  startLongitude: 10.971546,
  missions: getMissions(numberOfMissions),
})

export const loadRecentBannersAction = () => async (
  dispatch: Dispatch<BannerActionTypes>
) => {
  const bannerList: Array<Banner> = []
  bannerList.push(getBanner(1, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(2, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(3, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(4, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(5, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(6, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(7, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(8, getRandomInt(20, 6, 0)))
  bannerList.push(getBanner(9, getRandomInt(20, 6, 0)))

  dispatch({
    type: LOAD_RECENT_BANNERS,
    payload: bannerList,
  })
}
