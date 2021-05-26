import _ from 'underscore'
import { Mission } from '../../mission'
import { Title } from './types'

export class TitleExtractor {
  private titles: Array<Title> = []

  public total: number = 0

  constructor(titles?: Array<Mission>) {
    if (titles) {
      this.fill(titles)
    }
  }

  add = (pos: number, val: string, mission: string) => {
    const prev = this.titles.filter(
      (t) =>
        t.missions.includes(mission) &&
        t.pos[t.missions.indexOf(mission)] === pos - 1
    )
    const curr = this.titles.find(
      (t) => t.val.toLowerCase() === val.toLowerCase()
    )
    if (curr) {
      curr.missions.push(mission)
      curr.pos.push(pos)
    } else {
      this.titles.push({ val, missions: [mission], pos: [pos] })
    }
    if (prev && prev.length) {
      prev.forEach((p) => {
        const newVal = `${p.val}${val}`
        const added = this.titles.find(
          (t) => t.val.toLowerCase() === newVal.toLowerCase()
        )
        if (added) {
          added.missions.push(mission)
          added.pos.push(pos)
        } else {
          this.titles.push({ val: newVal, missions: [mission], pos: [pos] })
        }
      })
    }
  }

  fill = (titles: Array<Mission>) => {
    let i = 0
    let finished = 0
    while (finished < titles.length) {
      for (let j = 0; j < titles.length; j += 1) {
        const { id, title } = titles[j]
        if (title.length > i) {
          const c = title[i]
          this.add(i, c, id)
        } else if (title.length === i) {
          finished += 1
        }
      }
      i += 1
    }
    this.total += titles.length
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
