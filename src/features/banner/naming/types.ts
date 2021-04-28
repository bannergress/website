export interface NumberCandidateExtractor {
  regexp: RegExp
  parseFunction: (m: RegExpMatchArray) => number
  baseScoreFunction: (s: string) => number
}
export interface NumberMarker extends PositionMarker {
  type: string
  parsed: number
}

export interface PositionMarker {
  start: number
  raw: string
}
export interface IntermediateMissionExtractionResult {
  title: string
  remainingNumberCandidates: NumberMarker[] | undefined
  remainingTitleCandidates: PositionMarker[] | undefined
  missionMarker: NumberMarker | undefined
  totalMarker: PositionMarker | undefined
  titleMarker: PositionMarker | undefined
}
export interface IntermediateExtractionResult {
  total: number | undefined
  title: string | undefined
  results: IntermediateMissionExtractionResult[]
}
export interface MissionExtractionResult {
  missionMarker: NumberMarker | undefined
  totalMarker: PositionMarker | undefined
  titleMarker: PositionMarker | undefined
}
export interface ExtractionResult {
  total: number | undefined
  title: string | undefined
  results: MissionExtractionResult[]
}