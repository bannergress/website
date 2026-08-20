import { describe, expect, it } from 'vitest'
import { titleAndNumberingExtraction } from './extraction'
import { TitleExtractor } from './titleExtractor'
import { Mission } from '../../mission'

const makeMissions = (titles: string[]): Mission[] =>
  titles.map((title, i) => ({ id: `m${i}`, title, picture: '' }))

const run = (titles: string[]) => {
  const missions = makeMissions(titles)
  const extractor = new TitleExtractor(missions)
  return titleAndNumberingExtraction(missions, extractor)
}

describe('features > banner > naming > extraction (issue #309)', () => {
  it('does not treat a common word ("di", Italian for "of") as a roman numeral', () => {
    const result = run(
      Array.from(
        { length: 12 },
        (unused, index) => `il cittone dejavu (${index + 1} di 12)`
      )
    )
    expect(result.title).toEqual('il cittone dejavu')
    expect(result.total).toEqual(12)
    expect(result.results.map((r) => r.index)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ])
  })

  it('does not leave a dangling "#" when the numbering uses a trailing #N marker', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) => `#SecondSunday Oktober Staatz #${index + 1}`
      )
    )
    expect(result.title).toEqual('SecondSunday Oktober Staatz')
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not mistake a bare calendar year for the mission total', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) =>
          `${index + 1}_6 SECOND SUNDAY TENERIFE NOVIEMBRE 2022`
      )
    )
    expect(result.title).toEqual('SECOND SUNDAY TENERIFE NOVIEMBRE')
    expect(result.total).toEqual(6)
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not confuse a droid-name-like code (R2-D2) with grid/index numbering', () => {
    const result = run([
      '[9] Toast Wars - Chewbacca',
      '[10] Toast Wars - Leia Skywalker',
      '[11] Toast Wars - Luke Skywalker',
      '[12] Toast Wars - Darth Vader',
      '[13] Toast Wars - Millenium Falcon',
      '[14] Toast Wars - Destruction of Alderaan',
      '[15] Toast Wars - Resistance Fighter Jets',
      '[16] Toast Wars - Galactic Empire Ships',
      '[17] Toast Wars - Death Star',
      '[18] Toast Wars - Galactic Empire Fighters',
      '[03] Toast Wars - R2-D2',
    ])
    expect(result.title).toEqual('Toast Wars')
    expect(result.results.map((r) => r.index)).toEqual([
      9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 3,
    ])
  })

  it('strips a "[N of Total]" prefix once the year in the title no longer confuses the total', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) =>
          `[${index + 1} of 6] #Ingress2S - Tanauan  [Aug 2022]`
      )
    )
    expect(result.title).toEqual('Ingress2S - Tanauan  [Aug 2022]')
    expect(result.total).toEqual(6)
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not leave a dangling "[" when the numbering uses a "Title [ N ]" suffix', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) => `MANADO SECOND SUNDAY [ ${71 + index} ]`
      )
    )
    expect(result.title).toEqual('MANADO SECOND SUNDAY')
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not leave a dangling "_" when the numbering uses a "#N_Title" prefix', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) => `#${index + 1}_SecondSundayNov_Epiphany_Manado`
      )
    )
    expect(result.title).toEqual('SecondSundayNov_Epiphany_Manado')
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('does not leave a dangling "(" when the numbering uses a "Title (NN-Total)" suffix', () => {
    const result = run(
      Array.from(
        { length: 6 },
        (unused, index) =>
          `Coloreando los Domingos (${String(index + 1).padStart(2, '0')}-06)`
      )
    )
    expect(result.title).toEqual('Coloreando los Domingos')
    expect(result.total).toEqual(6)
    expect(result.results.map((r) => r.index)).toEqual([1, 2, 3, 4, 5, 6])
  })
})
