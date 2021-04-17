import { api } from '../../api'
import { Banner, Mission, NumDictionary } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'

const getRandomInt = (max: number, multiplier: number, min: number) =>
  Math.floor(Math.random() * (max + 1)) * multiplier + min

const getMissions = (numberOfMissions: number) => {
  const missionList: NumDictionary<Mission> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    const imgUrl = `/badges/mission-set-${(i % 18) + 1}.png`
    missionList[i] = {
      id: (i + 1).toString(),
      title: `test mission ${i + 1}`,
      picture: imgUrl,
      steps: [
        {
          poi: {
            id: '1',
            picture: '',
            title: 'Mock POI 1',
            type: 'portal',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'hack',
        },
        {
          poi: {
            id: '2',
            picture: '',
            title: 'Mock POI 2',
            type: 'portal',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'hack',
        },
        {
          poi: {
            id: '3',
            picture: '',
            title: 'Mock POI 3',
            type: 'fieldTrip',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'fieldTrip',
        },
        {
          poi: {
            id: '4',
            picture: '',
            title: 'Mock POI 4',
            type: 'portal',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'hack',
        },
        {
          poi: {
            id: '5',
            picture: '',
            title: 'Mock POI 5',
            type: 'portal',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'capture or upgrade',
        },
        {
          poi: {
            id: '6',
            picture: '',
            title: 'Mock POI 6',
            type: 'portal',
            latitude: 49.032618 + getRandomInt(200, 0.0001, 0),
            longitude: 10.971546 + getRandomInt(200, 0.0001, 0),
          },
          objective: 'hack',
        },
      ],
    }
  }
  return missionList
}

const createBanner = (id: string, numberOfMissions: number): Banner => ({
  title: `Banner #${id}`,
  numberOfMissions,
  uuid: id,
  lengthMeters: getRandomInt(5000, 1, 200),
  startLatitude: 49.032618,
  startLongitude: 10.971546,
  missions: getMissions(numberOfMissions),
  formattedAddress: 'New York, NY',
  picture:
    'https://test.api.bannergress.com/banners/pictures/6e146b8681689b1a62b5e088a9865189',
})

const createBanners = () => {
  const bannerList: Array<Banner> = []
  bannerList.push(createBanner('1', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('2', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('3', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('4', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('5', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('6', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('7', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('8', getRandomInt(20, 6, 0)))
  bannerList.push(createBanner('9', getRandomInt(20, 6, 0)))
  return bannerList
}

export const getBanner = (id: string) =>
  isMock
    ? { data: createBanner(id, getRandomInt(20, 6, 0)), ok: true, status: 200 }
    : api.get<Banner>(`banners/${id}`)

export const getRecentBanners = (numberOfBanners: number) =>
  isMock
    ? { data: createBanners(), ok: true, status: 200 }
    : api.get<Array<Banner>>('banners', {
        orderBy: 'created',
        orderDirection: 'DESC',
        limit: numberOfBanners,
      })

export const getBanners = (
  placeId: string,
  order: string,
  orderDirection: string
) =>
  isMock
    ? { data: createBanners(), ok: true, status: 200 }
    : api.get<Array<Banner>>('banners', {
        orderBy: order,
        orderDirection,
        placeId,
        limit: 10,
      })
