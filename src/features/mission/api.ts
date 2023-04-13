import { api } from '../../api'
import { MissionFilter } from './filter'
import { Mission } from './types'

const isMock = process.env.REACT_APP_USE_MOCK === 'true'
export const PAGE_SIZE = 100

const getMissions = (startIndex: number, numberOfMissions: number) => {
  const missionList: Array<Mission> = []
  for (let i = 0; i < numberOfMissions; i += 1) {
    const imgUrl = `/badges/mission-set-${(i % 18) + 1}.png`
    missionList.push({
      id: (startIndex + i + 1).toString(),
      title: `test mission ${startIndex + i + 1}`,
      picture: imgUrl,
      description: 'Hack Runde durch Weißenburg',
      status: 'published',
    })
  }
  return missionList
}

export const searchMissions = (
  location: string | null,
  query: string,
  filter: MissionFilter,
  page: number
) =>
  isMock
    ? { data: getMissions(page * PAGE_SIZE, PAGE_SIZE), ok: true, status: 200 }
    : api.get<Array<Mission>>('missions/unused', {
        query,
        orderBy: filter.orderBy,
        orderDirection: filter.orderDirection,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      })
