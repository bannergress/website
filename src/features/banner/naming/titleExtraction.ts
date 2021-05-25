import _, { isObject } from 'underscore'

import {
  IntermediateExtractionResult,
  NumberMarker,
  NumberCandidateExtractor,
  PositionMarker,
  ExtractionResult,
} from './types'
import arabicNumerals from './arabicNumerals'
import romanNumerals from './romanNumerals'
import latinLettersArabicNumeralsBase6 from './latinLettersArabicNumeralsBase6'
import { Mission } from '../../mission'
import { TitleExtractor } from './titleExtractor'

const extractors: { [key: string]: NumberCandidateExtractor } = {
  arabicNumerals,
  romanNumerals,
  latinLettersArabicNumeralsBase6,
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

function extractNumbers(
  prevExtractionResult: IntermediateExtractionResult,
  prop: 'missionMarker' | 'totalMarker',
  scoreFunction: (c: NumberMarker, e: IntermediateExtractionResult) => number
) {
  return {
    ...prevExtractionResult,
    results: prevExtractionResult.results.map((missionResult) => {
      let bestCandidate: NumberMarker | undefined
      let bestScore = 0
      missionResult.remainingNumberCandidates!.forEach((candidate) => {
        const score = scoreFunction(candidate, prevExtractionResult)
        if (score > bestScore) {
          bestCandidate = candidate
          bestScore = score
        }
      })
      return {
        ...missionResult,
        [prop]: bestCandidate,
        remainingNumberCandidates: missionResult.remainingNumberCandidates!.filter(
          (c) => c !== bestCandidate
        ),
      }
    }),
  }
}

function scoreAsMission(
  candidate: NumberMarker,
  extractionResult: IntermediateExtractionResult
) {
  let score = extractors[candidate.type].baseScoreFunction(candidate.raw)
  if (candidate.parsed > extractionResult.results.length) {
    // Reduce score a little bit because we don't have that many missions
    score *= 1 - candidate.parsed * 0.0001
  }
  // Score with respect to the same number type in other missions
  if (extractionResult.results.length >= 2) {
    const overallScore =
      extractionResult.results
        .map((missionExtractionResult) => {
          return missionExtractionResult
            .remainingNumberCandidates!.map((otherCandidates) => {
              if (
                otherCandidates.parsed !== candidate.parsed &&
                otherCandidates.type === candidate.type
              ) {
                return Math.max(
                  0,
                  1 - 0.01 * Math.abs(candidate.start - otherCandidates.start)
                )
              }
              return 0
            })
            .reduce((a, b) => Math.max(a, b), 0)
        })
        .reduce((a, b) => a + b) / extractionResult.results.length
    score *= overallScore
  }
  return score
}

function scoreAsTotal(
  candidate: NumberMarker,
  extractionResult: IntermediateExtractionResult
) {
  if (candidate.parsed !== extractionResult.total) {
    return 0
  }
  let score = extractors[candidate.type].baseScoreFunction(candidate.raw)
  if (extractionResult.results.length >= 2) {
    const overallScore =
      extractionResult.results
        .map((missionExtractionResult) => {
          return missionExtractionResult
            .remainingNumberCandidates!.map((otherCandidates) => {
              if (
                otherCandidates.parsed === candidate.parsed &&
                otherCandidates.type === candidate.type
              ) {
                return Math.max(
                  0,
                  1 - 0.01 * Math.abs(candidate.start - otherCandidates.start)
                )
              }
              return 0
            })
            .reduce((a, b) => Math.max(a, b), 0)
        })
        .reduce((a, b) => a + b, 0) / extractionResult.results.length
    score *= overallScore
  }
  return score
}

function toTitleCandidate(
  title: String,
  trimStart: boolean,
  trimEnd: boolean,
  start: number,
  length?: number
): PositionMarker | undefined {
  let raw = title.substr(start, length)
  if (trimStart) {
    raw = raw.replace(
      /^[\p{Separator}\p{Connector_Punctuation}\p{Dash_Punctuation}\p{Close_Punctuation}\p{Final_Punctuation}\p{Other_Punctuation}]+/gu,
      ''
    )
  }
  if (trimEnd) {
    raw = raw.replace(
      /[\p{Separator}\p{Connector_Punctuation}\p{Dash_Punctuation}\p{Open_Punctuation}\p{Initial_Punctuation}\p{Other_Punctuation}]+$/gu,
      ''
    )
  }
  return raw
    ? {
        start: title.indexOf(raw),
        raw,
      }
    : undefined
}

function extractCandidateNumbers(
  titles: string[]
): IntermediateExtractionResult {
  return {
    title: undefined,
    total: undefined,
    results: titles.map((title) => ({
      title,
      remainingNumberCandidates: extractCandidateNumbersForTitle(title),
      remainingTitleCandidates: undefined,
      mission: undefined,
      missionMarker: undefined,
      titleMarker: undefined,
      totalMarker: undefined,
    })),
  }
}

function extractMissionNumbers(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  return extractNumbers(prevExtractionResult, 'missionMarker', scoreAsMission)
}

function extractBestTotal(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  const flattened = prevExtractionResult.results
    .map(
      (prevMissionExtractionResult) =>
        prevMissionExtractionResult.remainingNumberCandidates!
    )
    .flat(1)
  const counts: Map<number, number> = new Map()
  flattened.forEach((candidate) => {
    const count = counts.get(candidate.parsed) || 0
    counts.set(candidate.parsed, count + 1)
  })
  let bestTotal
  let bestCount = 0
  counts.forEach((count, total) => {
    if (
      count > bestCount ||
      (count === bestCount && total === prevExtractionResult.results.length)
    ) {
      bestTotal = total
      bestCount = count
    }
  })
  return {
    ...prevExtractionResult,
    total: bestTotal,
  }
}

function extractTotalNumbers(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  return extractNumbers(prevExtractionResult, 'totalMarker', scoreAsTotal)
}

function extractCandidateTitles(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  return {
    ...prevExtractionResult,
    results: prevExtractionResult.results.map((prevER) => {
      const candidateTitles: PositionMarker[] = []
      if (prevER.missionMarker) {
        const firstMarkerStart = Math.min(
          prevER.missionMarker.start,
          prevER.totalMarker ? prevER.totalMarker.start : Infinity
        )
        const lastMarkerEnd = Math.max(
          prevER.missionMarker.start + prevER.missionMarker.raw.length,
          prevER.totalMarker
            ? prevER.totalMarker.start + prevER.totalMarker.raw.length
            : -Infinity
        )
        const firstCandidate = toTitleCandidate(
          prevER.title,
          false,
          true,
          0,
          firstMarkerStart
        )
        if (firstCandidate) {
          candidateTitles.push(firstCandidate)
        }
        const secondCandidate = toTitleCandidate(
          prevER.title,
          true,
          false,
          lastMarkerEnd
        )
        if (secondCandidate) {
          candidateTitles.push(secondCandidate)
        }
      } else if (prevExtractionResult.results.length >= 2) {
        // Consider all prefixes of the title
        for (let i = prevER.title.length; i >= 1; i -= 1) {
          const candidate = toTitleCandidate(prevER.title, false, true, 0, i)
          if (candidate && candidate.raw.length === i) {
            candidateTitles.push(candidate)
          }
        }
        // Consider all proper suffixes of the title
        for (let i = 1; i < prevER.title.length; i += 1) {
          const candidate = toTitleCandidate(prevER.title, true, false, i)
          if (candidate && candidate.raw.length === prevER.title.length - i) {
            candidateTitles.push(candidate)
          }
        }
      }
      return {
        ...prevER,
        remainingTitleCandidates: candidateTitles,
      }
    }),
  }
}

function extractBestTitle(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  const flattened = prevExtractionResult.results
    .map(
      (prevMissionExtractionResult) =>
        prevMissionExtractionResult.remainingTitleCandidates!
    )
    .flat(1)
  const counts: Map<string, number> = new Map()
  flattened.forEach((candidate) => {
    const count = counts.get(candidate.raw) || 0
    counts.set(candidate.raw, count + 1)
  })
  let bestTitles: string[] = []
  let bestCount = 0
  counts.forEach((count, title) => {
    if (count === bestCount && count >= 2) {
      if (
        !bestTitles.length ||
        bestTitles.findIndex((bestTitle) => bestTitle.indexOf(title) !== -1) ===
          -1
      ) {
        bestTitles.push(title)
      }
    } else if (count > bestCount) {
      bestTitles = [title]
      bestCount = count
    }
  })
  return {
    ...prevExtractionResult,
    title: bestTitles.length <= 2 ? bestTitles.join(' / ') : undefined,
  }
}

function extractTitles(
  prevExtractionResult: IntermediateExtractionResult
): IntermediateExtractionResult {
  return {
    ...prevExtractionResult,
    results: prevExtractionResult.results.map((missionResult) => {
      const bestCandidate = missionResult.remainingTitleCandidates!.find(
        (candidate) => candidate.raw === prevExtractionResult.title
      )
      return {
        ...missionResult,
        titleMarker: bestCandidate,
        remainingTitleCandidates: missionResult.remainingTitleCandidates!.filter(
          (c) => c !== bestCandidate
        ),
      }
    }),
  }
}

function cleanResult(
  prevExtractionResult: IntermediateExtractionResult
): ExtractionResult {
  return {
    ...prevExtractionResult,
    results: prevExtractionResult.results.map((prevER) => ({
      missionMarker: prevER.missionMarker,
      totalMarker: prevER.totalMarker,
      titleMarker: prevER.titleMarker,
    })),
  }
}

export const extractNumbers2 = (
  missions: Array<Mission>,
  dic: TitleExtractor
) => {
  const bestTitle = dic.bestTitle()
  const extractedNumbers = missions.map((mission) => {
    let index: number | undefined
    let total: number | undefined
    let maybeTotal: number | undefined
    const { title } = mission
    const extractClean = extractCandidateNumbersForTitle(
      title.replace(bestTitle?.val ?? '', '')
    )
    const extractDirty = extractCandidateNumbersForTitle(title)
    if (extractClean && extractClean.length > 0) {
      const min = _(extractClean).min((e) => e.parsed)
      const max = _(extractClean).max((e) => e.parsed)
      if (isObject(min)) {
        index = min.parsed
      }
      if (isObject(max) && max !== min) {
        total = max.parsed
      }
    }
    if (extractDirty && extractDirty.length) {
      const min = _(extractDirty).min((e) => e.parsed)
      const max = _(extractDirty).max((e) => e.parsed)
      if (!index && isObject(min)) {
        index = min.parsed
      }
      if (isObject(max) && max !== min) {
        maybeTotal = max.parsed
      }
    }
    return {
      index,
      total: total ?? maybeTotal,
    }
  })
  return extractedNumbers
}

export const newExtraction = (
  missions: Array<Mission>,
  addedMissions: Array<Mission>,
  extractor: TitleExtractor
) => {
  extractor.fill(addedMissions)
  const bestTitle = extractor.bestTitleClean()
  // console.log(dic.bestTitleClean())
  const extractedNumbers = extractNumbers2(missions, extractor)
  const totals = extractedNumbers
    .map((e) => e.total)
    .filter((e) => !!e) as Array<number>
  let total: number | undefined
  if (totals.length) {
    const res = _(totals)
      .chain()
      .countBy()
      .pairs()
      .sortBy((a) => a[0])
      .first()
      .value()
    total = Number(res![0])
  }
  return { title: bestTitle, results: extractedNumbers, total }
}

export function extract(titles: string[]): ExtractionResult {
  // Extract all candidate numbers
  const resultStep1 = extractCandidateNumbers(titles)
  // Find best matches for mission number and remove them
  const resultStep2 = extractMissionNumbers(resultStep1)
  // Find best total
  const resultStep3 = extractBestTotal(resultStep2)
  // Find best matches for total and remove them
  const resultStep4 = extractTotalNumbers(resultStep3)
  // Extract all candidate titles
  const resultStep5 = extractCandidateTitles(resultStep4)
  // Find best title
  const resultStep6 = extractBestTitle(resultStep5)
  // Find best matches for titles and remove them
  const resultStep7 = extractTitles(resultStep6)
  const result = cleanResult(resultStep7)
  return result
}
