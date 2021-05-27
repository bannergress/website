import _, { isObject } from 'underscore'

import {
  NumberMarker,
  NumberCandidateExtractor,
  IntermediateMissionNumber,
} from './types'
import arabicNumerals from './arabicNumerals'
import romanNumerals from './romanNumerals'
import latinLettersArabicNumeralsBase6 from './latinLettersArabicNumeralsBase6'
import natoNumerals from './natoNumerals'
import { Mission } from '../../mission'
import { TitleExtractor } from './titleExtractor'

const extractors: { [key: string]: NumberCandidateExtractor } = {
  arabicNumerals,
  romanNumerals,
  latinLettersArabicNumeralsBase6,
  natoNumerals,
}

function extractCandidateNumbersWithExtractor(
  input: string,
  type: string,
  extractor: NumberCandidateExtractor
): NumberMarker[] {
  const result = []
  const { regexp } = extractor
  regexp.lastIndex = 0
  let match = regexp.exec(input)
  while (match !== null) {
    const parsed = extractor.parseFunction(match)
    if (parsed !== undefined) {
      result.push({
        type,
        start: match.index!,
        raw: match[0],
        parsed,
      })
    }
    match = regexp.exec(input)
  }
  return result
}

function extractCandidateNumbersForTitle(input: string): NumberMarker[] {
  const result: NumberMarker[] = []
  Object.keys(extractors).forEach((key) => {
    const candidates = extractCandidateNumbersWithExtractor(
      input,
      key,
      extractors[key]
    )
    result.push(...candidates)
  })
  return result.sort(
    (a, b) =>
      a.start - b.start ||
      a.raw.length - b.raw.length ||
      a.type.localeCompare(b.type)
  )
}

const removeDates = (val: string) =>
  val.replace(
    /\b(((0[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])[-/.](?:20|)\d\d)|((0?[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[-/.](?:20|)\d\d)|((?:20|)\d\d[-/.](0?[1-9]|[12][0-9]|3[01])[-/.](0?[1-9]|1[012]))|((?:20|)\d\d[-/.](0?[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])))\b/,
    ''
  )

const extractCandidateNumbers2 = (
  missions: Array<Mission>,
  bestTitle: string | undefined
) =>
  missions.map((mission) => {
    let index: number | undefined
    let raw: string | undefined
    let total: number | undefined
    let maybeTotal: number | undefined
    const { title } = mission
    const extractClean = extractCandidateNumbersForTitle(
      removeDates(
        title
          .replace(bestTitle ?? '', '')
          // Replace Full-width digits
          .replace(/[\uFF10-\uFF19]/g, (m) =>
            String.fromCharCode(m.charCodeAt(0) - 0xfee0)
          )
      )
    )
    const extractDirty = extractCandidateNumbersForTitle(removeDates(title))
    if (extractClean && extractClean.length > 0) {
      if (extractClean.length === 1) {
        index = extractClean[0].parsed
        raw = extractClean[0].raw
      } else if (extractClean.length === 2) {
        const min = _(extractClean).min((e) => e.parsed)
        const max = _(extractClean).max((e) => e.parsed)
        if (isObject(min)) {
          index = min.parsed
          raw = min.raw
        }
        if (isObject(max)) {
          total = max.parsed
        }
      }
    }
    if (extractDirty && extractDirty.length) {
      const min = _(extractDirty).min((e) => e.parsed)
      const max = _(extractDirty).max((e) => e.parsed)
      if (!index && isObject(min)) {
        index = min.parsed
        raw = min.raw
      }
      if (isObject(max) && max !== min) {
        maybeTotal = max.parsed
      }
    }
    return {
      index,
      raw,
      total: total ?? maybeTotal,
      markersClean: extractClean,
      markers: [...extractClean, ...extractDirty],
    }
  })

const extractTotalNumber = (numbers: Array<IntermediateMissionNumber>) => {
  const total = _(numbers)
    .chain()
    .map((n) => n.total)
    .filter((n) => !!n)
    .countBy()
    .pairs()
    .max((p) => p[1])
    .value()
  if (_.isArray(total)) {
    const totalNum = Number(total[0])
    if (totalNum === numbers.length || totalNum % 6 === 0) {
      return totalNum
    }
  }
  return undefined
}

const refineExtractedNumbers = (
  numbers: Array<IntermediateMissionNumber>,
  total: number | undefined
) => {
  const allNumbersCount = _(numbers)
    .chain()
    .map((n) => n.markersClean)
    .flatten()
    .filter((p) => !!p.parsed)
    .countBy((p) => p.raw)
    .value()
  const allNumbersCountExtended = _(numbers)
    .chain()
    .map((n) => n.markers)
    .flatten()
    .filter((p) => !!p.parsed)
    .countBy((p) => p.raw)
    .value()
  return numbers.map((number) => {
    let { index } = number
    const { markersClean, raw } = number
    if (index && raw) {
      const matches = allNumbersCount[raw]
      const matchesExtended = allNumbersCountExtended[raw]
      if (matches > 1) {
        const withUses = _(markersClean)
          .chain()
          .filter((marker) => marker && marker.parsed)
          .map((marker) => ({
            ...marker,
            uses: allNumbersCount[marker.raw],
          }))
          .sortBy((marker) => marker.uses)
          .value()
        const maybeSection = withUses.find(
          (marker) => marker.uses % 6 === 0 && marker.parsed < 6
        )

        let lesserUsed = _(withUses)
          .chain()
          .filter((marker) => marker !== maybeSection)
          .first()
          .value()
        if (_.isObject(lesserUsed)) {
          const best = _(withUses)
            .chain()
            .filter(
              (marker) =>
                marker.uses === lesserUsed!.uses &&
                (!maybeSection || marker !== maybeSection)
            )
            .countBy((marker) => marker.raw)
            .pairs()
            .sortBy((marker) => marker[1])
            .reverse()
            .first()
            .value()
          if (best) {
            lesserUsed = withUses.find((marker) => marker.raw === best[0])!
          }
          if (
            lesserUsed.uses > 1 &&
            lesserUsed.uses > numbers.length - numbers.length / 5 &&
            lesserUsed.parsed !== total &&
            index === lesserUsed.parsed
          ) {
            // Number is used in almost all missions, probably not an index
            index = undefined
          } else if (
            lesserUsed.parsed !== index &&
            (!total || lesserUsed.parsed <= total) &&
            (!maybeSection || maybeSection !== lesserUsed)
          ) {
            index = lesserUsed.parsed
          }
          if (index && maybeSection) {
            index += (maybeSection.parsed - 1) * maybeSection.uses
          }
        }
      } else if (matchesExtended > numbers.length - numbers.length / 5) {
        // Number is used in almost all missions, probably not an index
        index = undefined
      }
      if (
        index &&
        ((total && index > total * 2) ||
          (index > numbers.length * 2 && numbers.length > 5))
      ) {
        // It seems the number has the total joined with the mission number, try to remove
        const tot = (total ?? numbers.length).toString()
        const indexStr = index.toString()
        if (indexStr.endsWith(tot)) {
          index = Number(indexStr.substr(0, indexStr.length - tot.length))
        } else if (indexStr.startsWith(tot)) {
          index = Number(indexStr.substr(tot.length))
        }
      }
    }
    return {
      index,
      total,
    }
  })
}

export const extractNumbers2 = (
  missions: Array<Mission>,
  dic: TitleExtractor
) => {
  const bestTitle = dic.bestTitle()
  const extractedNumbers = extractCandidateNumbers2(missions, bestTitle?.val)
  const total = extractTotalNumber(extractedNumbers)
  const refinedNumbers = refineExtractedNumbers(extractedNumbers, total)
  return { results: refinedNumbers, total }
}

export const cleanTitle = (title1: string, title2: string, total?: number) => {
  let part1 = title1
  let part2 = title2
  if (total) {
    part1 = part1.replace(
      new RegExp(
        `^[\\w.-]{0,3}\\s*\\#?${total}[\\s\\-\\/\\])]+|[\\s\\-\\/[(,]+\\#?${total}\\s*[\\w.-]{0,3}$$`,
        'gi'
      ),
      ''
    )
    part2 = part2.replace(
      new RegExp(
        `^[\\w.-]{0,3}\\s*\\#?${total}[\\s\\-\\/\\])]+|[\\s\\-\\/[(,]+\\#?${total}\\s*[\\w.-]{0,3}$$`,
        'gi'
      ),
      ''
    )
  } else {
    part1 = part1.replace(/^(nr?o?|ч)\.?\s+|\s+(nr?o?|ч)\.?$/gi, '')
    part2 = part2.replace(/^(nr?o?|ч)\.?\s+|\s+(nr?o?|ч)\.?$/gi, '')
  }
  return `${part1}${part2 ? ` ${part2}` : ''}`
}

export const newExtraction = (
  missions: Array<Mission>,
  addedMissions: Array<Mission>,
  extractor: TitleExtractor
) => {
  extractor.fill(addedMissions)
  const [bestTitle1, bestTitle2] = extractor.bestCombinedTitle()
  // console.log(dic.bestTitleClean())
  const extractedNumbers = extractNumbers2(missions, extractor)
  const title = cleanTitle(bestTitle1, bestTitle2, extractedNumbers.total)
  return {
    title,
    ...extractedNumbers,
  }
}
