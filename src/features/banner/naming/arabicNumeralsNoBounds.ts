import { NumberCandidateExtractor } from './types'

const extractor: NumberCandidateExtractor = {
  regexp: /(?:N°\s?|Nr.\s?|no.\s?|#)?([0-9]*[1-9][0-9]*)/gi,
  parseFunction: (match) => Number.parseInt(match[1], 10),
  baseScoreFunction: () => 0.9,
}

export default extractor
