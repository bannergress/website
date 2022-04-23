export type MissionOrder =
| 'title'

export type MissionOrderDirection = 'ASC' | 'DESC'

export type MissionFilter = {
  orderBy: MissionOrder
  orderDirection: MissionOrderDirection
}
