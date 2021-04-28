import { NumberCandidateExtractor } from "./types";

const extractor: NumberCandidateExtractor = {
    regexp: /\b(?:(I[VX]|VI{0,3}|I{1,3})|(?:(X[LC]|LX{0,3}|X{1,3})(I[VX]|V?I{0,3}))|(?:(C[DM]|DC{0,3}|C{1,3})(X[LC]|L?X{0,3})(I[VX]|V?I{0,3}))|(?:(M+)(C[DM]|D?C{0,3})(X[LC]|L?X{0,3})(I[VX]|V?I{0,3})))\b/ig,
    parseFunction: (match) => {
        let result = 0;
        for (const part of match.slice(1)) {
            result += parsePart(part);
        }
        return result;
    },
    baseScoreFunction: text => Math.min(text.length * .25, 1)
};

function parsePart(part: string | undefined) {
    if (!part) {
        return 0;
    }
    switch (part) {
        case 'I': return 1;
        case 'II': return 2;
        case 'III': return 3;
        case 'IV': return 4;
        case 'V': return 5;
        case 'VI': return 6;
        case 'VII': return 7;
        case 'VIII': return 8;
        case 'IX': return 9;
        case 'X': return 10;
        case 'XX': return 20;
        case 'XXX': return 30;
        case 'XL': return 40;
        case 'L': return 50;
        case 'LX': return 60;
        case 'LXX': return 70;
        case 'LXXX': return 80;
        case 'XC': return 90;
        case 'C': return 100;
        case 'CC': return 200;
        case 'CCC': return 300;
        case 'CD': return 400;
        case 'D': return 500;
        case 'DC': return 600;
        case 'DCC': return 700;
        case 'DCCC': return 800;
        case 'CM': return 900;
        default: return part.length * 1000;
    }
}

export default extractor;
