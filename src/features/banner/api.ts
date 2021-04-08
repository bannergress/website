import { api } from '../../api'
import { Banner, Dictionary, Mission } from './types'

const isMock = process.env.USE_MOCK || true

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

const createBanner = (id: number, numberOfMissions: number) => ({
  title: `Banner #${id}`,
  numberOfMissions,
  id,
  lenghtMeters: getRandomInt(5000, 1, 100),
  startLatitude: 49.032618,
  startLongitude: 10.971546,
  missions: getMissions(numberOfMissions),
})

const getBanners = () => {
  const bannerList: Array<Banner> = []
  bannerList.push(createBanner(1, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(2, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(3, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(4, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(5, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(6, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(7, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(8, getRandomInt(20, 6, 0)))
  bannerList.push(createBanner(9, getRandomInt(20, 6, 0)))
  return bannerList
}

export const getBanner = (id: number) =>
  isMock
    ? { data: createBanner(id, getRandomInt(20, 6, 0)), ok: true, status: 200 }
    : api.get<Banner>(`banners/${id}`)

export const getRecentBanners = (numberOfBanners: number) =>
  isMock
    ? { data: getBanners(), ok: true, status: 200 }
    : api.get<Array<Banner>>('banners', {
        orderBy: 'created',
        orderDirection: 'DESC',
        limit: numberOfBanners,
      })
