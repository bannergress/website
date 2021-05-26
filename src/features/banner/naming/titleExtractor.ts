import _ from 'underscore'
import { Mission } from '../../mission'
import { Title, TitleDictionary } from './types'

export class TitleExtractor {
  private titles: Array<Title> = []

  private dictionary: TitleDictionary = {}

  public total: number = 0

  constructor(titles?: Array<Mission>) {
    if (titles) {
      this.fill(titles)
    }
  }

  add = (id: string, title: string) => {
    let next: Array<Title> = []
    for (let i = 0; i < title.length; i += 1) {
      const prev = [...next]
      next = []
      const val = title[i]
      const curr = this.dictionary[val.toLowerCase()]
      if (curr) {
        curr.missions.push(id)
        curr.pos.push(i)
        next.push(curr)
      } else {
        const newItem = { val, missions: [id], pos: [i] }
        this.titles.push(newItem)
        this.dictionary[val.toLowerCase()] = newItem
        next.push(newItem)
      }
      if (prev && prev.length) {
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        prev.forEach((p) => {
          const newVal = `${p.val}${val}`
          const added = this.dictionary[newVal.toLowerCase()]
          if (added) {
            added.missions.push(id)
            added.pos.push(i)
            next.push(added)
          } else {
            const newItem = { val: newVal, missions: [id], pos: [i] }
            this.titles.push(newItem)
            this.dictionary[newVal.toLowerCase()] = newItem
            next.push(newItem)
          }
        })
      }
    }
  }

  fill = (missions: Array<Mission>) => {
    missions.forEach((mission) => {
      const { id, title } = mission
      this.add(id, title)
    })
  }

  remove = (mission: Mission) => {
    const includes = this.titles.filter((t) => t.missions.includes(mission.id))
    includes.forEach((title) => {
      if (title.missions.length > 1) {
        // eslint-disable-next-line no-param-reassign
        title.missions = _(title.missions).without(mission.id)
      } else {
        this.titles = _(this.titles).without(title)
      }
    })
  }

  reset = () => {
    this.total = 0
    this.titles = []
    this.dictionary = {}
  }

  bestTitle = (): Title | undefined => {
    const best = _(this.titles).max((t) => {
      const m = _(t.missions).uniq().length
      return m * t.val.length ** 2 - (m - this.total) ** 2
    })
    return _.isObject(best) ? best : undefined
  }

  bestTitleClean = () => {
    const title = this.bestTitle()
    return title?.val.replace(/^[\s\-/\])]+|[\s\-/[(,]+$/gi, '')
  }

  bestCombinedTitle = (): [string, string] => {
    const scored = _(this.titles)
      .chain()
      .map((t) => {
        const m = _(t.missions).uniq().length
        return { ...t, score: m * t.val.length ** 2 - (m - this.total) ** 2 }
      })
      .sortBy((t) => t.score)
      .reverse()
      .value()
    const best = _(scored).first()
    let part1 = best?.val ?? ''
    let part2 = ''
    if (best) {
      const findMatch = _(scored).find(
        (t) =>
          t.val.length > 3 &&
          _(t.missions).uniq().length === _(best.missions).uniq().length &&
          ((t.pos[0] < best.pos[0] &&
            t.pos[0] < best.pos[0] - best.val.length) ||
            (t.pos[0] > best.pos[0] &&
              t.pos[0] > best.pos[0] - best.val.length))
      )
      if (findMatch) {
        if (best.pos[0] < findMatch.pos[0]) {
          part2 = findMatch.val
        }
        if (best.pos[0] > findMatch.pos[0]) {
          part1 = findMatch.val
          part2 = best.val
        }
      }
    }
    return [
      part1.replace(/^[\s\-/\])]+|[\s\-/[(,]+$/gi, ''),
      part2.replace(/^[\s\-/\])]+|[\s\-/[(,]+$/gi, ''),
    ]
  }
}
