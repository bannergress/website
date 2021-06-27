import _, { isObject } from 'underscore'

import {
  NumberMarker,
  NumberCandidateExtractor,
  IntermediateMissionNumber,
} from './types'
import arabicNumerals from './arabicNumeralsNoBounds'
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

const totalRegex = (total: number) =>
  new RegExp(
    `^[\\w.-]{0,3}\\s*\\#?${total}[\\s\\-\\/\\])]+|[\\s\\-\\/[(,]+\\#?${total}\\s*[\\w.-]{0,3}$$`,
    'gi'
  )

const numberingRegex = /\s+(nr?o?|part|ч)\.?$/gi

const removeDates = (val: string) =>
  val.replace(
    /\b(((0[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])[-/.](?:20|)\d\d)|((0?[1-9]|[12][0-9]|3[01])[-/.](0[1-9]|1[012])[-/.](?:20|)\d\d)|((?:20|)\d\d[-/.](0?[1-9]|[12][0-9]|3[01])[-/.](0?[1-9]|1[012]))|((?:20|)\d\d[-/.](0?[1-9]|1[012])[-/.](0?[1-9]|[12][0-9]|3[01])))\b/,
    ''
  )

const extractCandidateNumbersWithExtractor = (
  input: string,
  type: string,
  extractor: NumberCandidateExtractor
): NumberMarker[] => {
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

const extractCandidateNumbersForTitle = (input: string) => {
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

const extractCandidateNumbers = (
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
          // Replace full-width digits
          .replace(/[\uFF10-\uFF19]/g, (m) =>
            String.fromCharCode(m.charCodeAt(0) - 0xfee0)
          )
      )
    )
    const extractDirty = extractCandidateNumbersForTitle(removeDates(title))

    // Get candidate index & total from clean title
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

    // If no numbers on clean title, try from entire tittle
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
    // Discard numbers not divisible by 6 if are different from missions added.
    // They're probably not the total but another number from the title
    if (totalNum === numbers.length || totalNum % 6 === 0) {
      return totalNum
    }
  }
  return undefined
}

const fillMarkersWithUses = (
  markers: Array<NumberMarker>,
  allNumbersCount: _.Dictionary<number>
) =>
  _(markers)
    .chain()
    .filter((marker) => marker && marker.parsed)
    .map((marker) => ({
      ...marker,
      uses: allNumbersCount[marker.raw],
    }))
    .sortBy((marker) => marker.uses)
    .value()

const findLessUsed = (
  markers: Array<NumberMarker & { uses: number }>,
  maybeSection: (NumberMarker & { uses: number }) | undefined
) =>
  _(markers)
    .chain()
    .filter((marker) => !_.isEqual(marker, maybeSection))
    .first()
    .value()

const findBestCandidate = (
  markers: Array<NumberMarker & { uses: number }>,
  lesserUsed: NumberMarker & { uses: number },
  maybeSection: (NumberMarker & { uses: number }) | undefined
) =>
  _(markers)
    .chain()
    .filter(
      (marker) =>
        marker.uses === lesserUsed.uses &&
        (!maybeSection || !_.isEqual(marker, maybeSection))
    )
    .countBy((marker) => marker.raw)
    .pairs()
    .sortBy((marker) => marker[1])
    .reverse()
    .first()
    .value()

const extractSections = (
  number: IntermediateMissionNumber,
  allNumbersCount: _.Dictionary<number>,
  total: number | undefined
) => {
  const { index } = number
  const { markersClean, raw } = number
  let maybeSection: (NumberMarker & { uses: number }) | undefined
  if (index && raw) {
    const matches = allNumbersCount[raw]
    if (matches > 1) {
      const withUses = fillMarkersWithUses(markersClean, allNumbersCount)

      // Try to find if one of the numbers if from the section (alpha, bravo...)
      // Only works if all the missions from the section are added and they all have that number
      maybeSection = withUses.find(
        (marker) =>
          marker.uses % 6 === 0 &&
          marker.parsed < 12 &&
          (!total ||
            marker.parsed !== total ||
            markersClean.filter((m) => m.parsed === total).length > 1)
      )
    }
  }
  return {
    ...number,
    index,
    total,
    maybeSection,
  }
}

const getRefinedCandidateNumber = (
  number: IntermediateMissionNumber & {
    maybeSection: (NumberMarker & { uses: number }) | undefined
  },
  allNumbersCount: _.Dictionary<number>,
  allNumbersCountExtended: _.Dictionary<number>,
  total: number | undefined,
  length: number,
  usesPerSection: number | undefined,
  sectionType: string | undefined
) => {
  let { index, maybeSection } = number
  const { markersClean, raw } = number
  if (index && raw) {
    const matches = allNumbersCount[raw]
    const matchesExtended = allNumbersCountExtended[raw]
    if (matches > 1) {
      const withUses = fillMarkersWithUses(markersClean, allNumbersCount)

      // Remove non matching section
      if (
        maybeSection?.uses !== usesPerSection ||
        maybeSection?.type !== sectionType
      ) {
        maybeSection = undefined
      }

      let lesserUsed = findLessUsed(withUses, maybeSection)
      if (_.isObject(lesserUsed)) {
        const best = findBestCandidate(withUses, lesserUsed, maybeSection)
        if (best) {
          lesserUsed = withUses.find((marker) => marker.raw === best[0])!
        }
        if (
          lesserUsed.uses > 1 &&
          lesserUsed.uses > length - length / 5 &&
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
          // Get lesser repeated number compared with other missions titles
          // We want to discard total or other numbers
          index = lesserUsed.parsed
        }
        if (index && maybeSection && maybeSection.parsed <= length / 6) {
          index += (maybeSection.parsed - 1) * maybeSection.uses
        }
      }
    } else if (
      matchesExtended > length - length / 5 &&
      ((total && index > total) || index > length)
    ) {
      // Number is used in almost all missions and it's large, probably not an index
      index = undefined
    }
    if (
      index &&
      ((total && index > total * 2 && length <= total) ||
        (index > length * 2 && length > 5))
    ) {
      // It seems the number has the total joined with the mission number, try to remove
      const tot = (total ?? length).toString()
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
}

const countBy = (
  numbers: Array<IntermediateMissionNumber>,
  selector: (number: IntermediateMissionNumber) => Array<NumberMarker>
) =>
  _(numbers)
    .chain()
    .map(selector)
    .flatten()
    .filter((p) => !!p.parsed)
    .countBy((p) => p.raw)
    .value()

const refineExtractedNumbers = (
  numbers: Array<IntermediateMissionNumber>,
  total: number | undefined
) => {
  const allNumbersCount = countBy(numbers, (n) => n.markersClean)
  const allNumbersCountExtended = countBy(numbers, (n) => n.markers)

  const withSections = numbers.map((number) =>
    extractSections(number, allNumbersCount, total)
  )
  const sections = _(withSections)
    .chain()
    .map((n) => n?.maybeSection)
    .filter((s) => !!s)
    .uniq(false, (s) => s!.raw)
    .value()
  let usesPerSection = 0
  let sectionType: string | undefined
  if (sections && sections.length) {
    sectionType = _(sections)
      .chain()
      .map((s) => s?.type)
      .countBy()
      .pairs()
      .sortBy((s) => s[1])
      .first()
      .value()?.[0]
    usesPerSection = Number(
      _(sections)
        .chain()
        .filter((s) => s?.type === sectionType)
        .map((s) => s!.uses)
        .countBy()
        .pairs()
        .sortBy((s) => s[1])
        .first()
        .value()?.[0]
    )
  }
  return withSections.map((number) =>
    getRefinedCandidateNumber(
      number!,
      allNumbersCount,
      allNumbersCountExtended,
      total,
      numbers.length,
      usesPerSection,
      sectionType
    )
  )
}

const extractNumbers = (missions: Array<Mission>, dic: TitleExtractor) => {
  const bestTitle = dic.bestTitle()
  const extractedNumbers = extractCandidateNumbers(missions, bestTitle?.val)
  const total = extractTotalNumber(extractedNumbers)
  const refinedNumbers = refineExtractedNumbers(extractedNumbers, total)
  return { results: refinedNumbers, total }
}

export const cleanTitle = (title1: string, title2: string, total?: number) => {
  let part1 = title1
  let part2 = title2
  if (total) {
    part1 = part1.replace(totalRegex(total), '')
    part2 = part2.replace(totalRegex(total), '')
  }
  part1 = part1.replace(numberingRegex, '')
  part2 = part2.replace(numberingRegex, '')
  return `${part1}${part2 ? ` ${part2}` : ''}`
}

export const titleAndNumberingExtraction = (
  missions: Array<Mission>,
  extractor: TitleExtractor
) => {
  const extractedNumbers = extractNumbers(missions, extractor)
  const [bestTitle1, bestTitle2] = extractor.bestCombinedTitle(
    extractedNumbers.total
  )
  const title = cleanTitle(bestTitle1, bestTitle2, extractedNumbers.total)
  return {
    title,
    ...extractedNumbers,
  }
}
