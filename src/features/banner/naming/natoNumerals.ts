import { NumberCandidateExtractor } from './types'

function parsePart(part: string | undefined) {
  if (!part) {
    return 0
  }
  switch (part.toLowerCase()) {
    case 'alpha':
    case 'alfa':
      return 1
    case 'bravo':
      return 2
    case 'charlie':
      return 3
    case 'delta':
      return 4
    case 'echo':
      return 5
    case 'foxtrot':
      return 6
    default:
      return 0
  }
}

const extractor: NumberCandidateExtractor = {
  regexp: /(alpha|alfa|bravo|charlie|delta|echo|foxtrot)/gi,
  parseFunction: (match) => parsePart(match[0]),
  baseScoreFunction: (text) => Math.min(text.length * 0.25, 1),
}

export default extractor
