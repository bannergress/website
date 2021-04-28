import { IntermediateExtractionResult, NumberMarker, NumberCandidateExtractor, PositionMarker, ExtractionResult } from './types';
import arabicNumerals from './arabicNumerals';
import romanNumerals from './romanNumerals';
import latinLettersArabicNumeralsBase6 from './latinLettersArabicNumeralsBase6';

const extractors: { [key: string]: NumberCandidateExtractor } = {
    arabicNumerals,
    romanNumerals,
    latinLettersArabicNumeralsBase6
}

export function extract(titles: string[]): ExtractionResult {
    debugger;
    // Extract all candidate numbers
    const resultStep1 = extractCandidateNumbers(titles);
    // Find best matches for mission number and remove them
    const resultStep2 = extractMissionNumbers(resultStep1);
    // Find best total
    const resultStep3 = extractBestTotal(resultStep2);
    // Find best matches for total and remove them
    const resultStep4 = extractTotalNumbers(resultStep3);
    // Extract all candidate titles
    const resultStep5 = extractCandidateTitles(resultStep4);
    // Find best title
    const resultStep6 = extractBestTitle(resultStep5);
    // Find best matches for titles and remove them
    const resultStep7 = extractTitles(resultStep6);
    const result = cleanResult(resultStep7);
    return result;
}

function cleanResult(prevExtractionResult: IntermediateExtractionResult): ExtractionResult {
    return {
        ...prevExtractionResult,
        results: prevExtractionResult.results.map(prevExtractionResult => ({
            missionMarker: prevExtractionResult.missionMarker,
            totalMarker: prevExtractionResult.totalMarker,
            titleMarker: prevExtractionResult.titleMarker
        }))
    }
}

function extractCandidateNumbers(titles: string[]): IntermediateExtractionResult {
    return {
        title: undefined,
        total: undefined,
        results: titles.map(title => ({
            title: title,
            remainingNumberCandidates: extractCandidateNumbersForTitle(title),
            remainingTitleCandidates: undefined,
            mission: undefined,
            missionMarker: undefined,
            titleMarker: undefined,
            totalMarker: undefined
        }))
    };
}

function extractMissionNumbers(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    return extractNumbers(prevExtractionResult, 'missionMarker', scoreAsMission);
}

function extractBestTotal(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    const flattened = prevExtractionResult.results.map(prevMissionExtractionResult => prevMissionExtractionResult.remainingNumberCandidates!).flat(1);
    const counts: Map<number, number> = new Map();
    flattened.forEach(candidate => {
        const count = counts.get(candidate.parsed) || 0;
        counts.set(candidate.parsed, count + 1);
    });
    let bestTotal;
    let bestCount = 0;
    counts.forEach((count, total) => {
        if (count > bestCount) {
            bestTotal = total;
            bestCount = count;
        }
    });
    return {
        ...prevExtractionResult,
        total: bestTotal
    };
}

function extractTotalNumbers(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    return extractNumbers(prevExtractionResult, 'totalMarker', scoreAsTotal);
}

function extractCandidateTitles(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    return {
        ...prevExtractionResult,
        results: prevExtractionResult.results.map(prevExtractionResult => {
            const candidateTitles: PositionMarker[] = [];
            if (prevExtractionResult.missionMarker) {
                const firstMarkerStart = Math.min(prevExtractionResult.missionMarker.start,
                    prevExtractionResult.totalMarker ? prevExtractionResult.totalMarker.start : Infinity);
                const lastMarkerEnd = Math.max(prevExtractionResult.missionMarker.start + prevExtractionResult.missionMarker.raw.length,
                    prevExtractionResult.totalMarker ? prevExtractionResult.totalMarker.start + prevExtractionResult.totalMarker.raw.length : -Infinity);
                const firstCandidate = toTitleCandidate(prevExtractionResult.title, 0, firstMarkerStart);
                if (firstCandidate) {
                    candidateTitles.push(firstCandidate);
                }
                const secondCandidate = toTitleCandidate(prevExtractionResult.title, lastMarkerEnd);
                if (secondCandidate) {
                    candidateTitles.push(secondCandidate);
                }
            }
            return {
                ...prevExtractionResult,
                remainingTitleCandidates: candidateTitles
            };
        })
    }
    return prevExtractionResult;
}

function extractBestTitle(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    const flattened = prevExtractionResult.results.map(prevMissionExtractionResult => prevMissionExtractionResult.remainingTitleCandidates!).flat(1);
    const counts: Map<string, number> = new Map();
    flattened.forEach(candidate => {
        const count = counts.get(candidate.raw) || 0;
        counts.set(candidate.raw, count + 1);
    });
    let bestTitle: string | undefined;
    let bestCount = 0;
    counts.forEach((count, title) => {
        if (!bestTitle || count * title.length > bestCount * bestTitle.length) {
            bestTitle = title;
            bestCount = count;
        }
    });
    return {
        ...prevExtractionResult,
        title: bestTitle
    };
}

function extractTitles(prevExtractionResult: IntermediateExtractionResult): IntermediateExtractionResult {
    return {
        ...prevExtractionResult,
        results: prevExtractionResult.results.map(missionResult => {
            let bestCandidate: PositionMarker | undefined;
            for (const candidate of missionResult.remainingTitleCandidates!) {
                if (candidate.raw === prevExtractionResult.title) {
                    bestCandidate = candidate;
                    break;
                }
            }
            return ({
                ...missionResult,
                titleMarker: bestCandidate,
                remainingTitleCandidates: missionResult.remainingTitleCandidates!.filter(c => c !== bestCandidate)
            });
        })
    };
}

function extractNumbers(prevExtractionResult: IntermediateExtractionResult,
                        prop: 'missionMarker' | 'totalMarker',
                        scoreFunction: (c: NumberMarker, e: IntermediateExtractionResult) => number) {
    return {
        ...prevExtractionResult,
        results: prevExtractionResult.results.map(missionResult => {
            let bestCandidate: NumberMarker | undefined;
            let bestScore = 0;
            for (const candidate of missionResult.remainingNumberCandidates!) {
                const score = scoreFunction(candidate, prevExtractionResult);
                if (score > bestScore) {
                    bestCandidate = candidate;
                    bestScore = score;
                }
            }
            return ({
                ...missionResult,
                [prop]: bestCandidate,
                remainingNumberCandidates: missionResult.remainingNumberCandidates!.filter(c => c !== bestCandidate)
            });
        })
    };
}

function extractCandidateNumbersForTitle(input: string): NumberMarker[] {
    const result: NumberMarker[] = [];
    for (const type in extractors) {
        const candidates = extractCandidateNumbersWithExtractor(input, type, extractors[type]);
        Array.prototype.push.apply(result, candidates);
    }
    return result.sort((a, b) => (a.start - b.start) || (a.raw.length - b.raw.length) || a.type.localeCompare(b.type));
}

function extractCandidateNumbersWithExtractor(input: string, type: string, extractor: NumberCandidateExtractor): NumberMarker[] {
    const result = [];
    const regexp = extractor.regexp;
    regexp.lastIndex = 0;
    let match; 
    while ((match = regexp.exec(input)) !== null) {
        result.push({
            type: type,
            start: match.index!,
            raw: match[0],
            parsed: extractor.parseFunction(match)
        });
    }
    return result;
}

function toTitleCandidate(title: String, start: number, length?: number): PositionMarker | undefined {
    const raw = title.substr(start, length).replace(/^[\p{Separator}\p{Punctuation}]+|[\p{Separator}\p{Punctuation}]+$/gu, '');
    return raw ? {
        start: title.indexOf(raw),
        raw
    } : undefined;
}

function scoreAsMission(candidate: NumberMarker, extractionResult: IntermediateExtractionResult) {
    let score = extractors[candidate.type].baseScoreFunction(candidate.raw);
    if (candidate.parsed > extractionResult.results.length) {
        // Reduce score a little bit because we don't have that many missions
        score *= 1 - candidate.parsed * 0.001;
    }
    // Score with respect to the same number type in other missions
    const overallScore = extractionResult.results.map(missionExtractionResult => {
        return missionExtractionResult.remainingNumberCandidates!.map(otherCandidates => {
            if (otherCandidates.parsed != candidate.parsed && otherCandidates.type == candidate.type) {
                return Math.max(0, 1 - 0.01 * Math.abs(candidate.start - otherCandidates.start));
            } else {
                return 0;
            }
        }).reduce((a, b) => Math.max(a, b), 0);
    }).reduce((a, b) => a + b, 0) / extractionResult.results.length;
    score *= overallScore;
    return score;
}

function scoreAsTotal(candidate: NumberMarker, extractionResult: IntermediateExtractionResult) {
    if (candidate.parsed !== extractionResult.total) {
        return 0;
    }
    let score = extractors[candidate.type].baseScoreFunction(candidate.raw);
    const overallScore = extractionResult.results.map(missionExtractionResult => {
        return missionExtractionResult.remainingNumberCandidates!.map(otherCandidates => {
            if (otherCandidates.parsed == candidate.parsed && otherCandidates.type == candidate.type) {
                return Math.max(0, 1 - 0.01 * Math.abs(candidate.start - otherCandidates.start));
            } else {
                return 0;
            }
        }).reduce((a, b) => Math.max(a, b), 0);
    }).reduce((a, b) => a + b, 0) / extractionResult.results.length;
    score *= overallScore;
    return score;
}
