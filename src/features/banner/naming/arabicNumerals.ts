import { NumberCandidateExtractor } from './types'

const extractor: NumberCandidateExtractor = {
  regexp: /\b(?:[0-9]{0,2}[1-9]|[0-9]?[1-9][0-9]?|[1-9][0-9]{0,2}})\b/g,
  parseFunction: (match) => Number.parseInt(match[0], 10),
  baseScoreFunction: () => 0.9,
}

export default extractor
