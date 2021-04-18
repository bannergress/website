import { NumberCandidateExtractor } from "./types";

const extractor: NumberCandidateExtractor = {
    regexp: /\b([a-z])-?([1-6])/ig,
    parseFunction: (match) => (match[1].toLowerCase().charCodeAt(0) - 97) * 6 + Number.parseInt(match[2]),
    baseScoreFunction: () => 1
};

export default extractor;
