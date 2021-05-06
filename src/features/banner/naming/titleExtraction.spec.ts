import { extract } from './titleExtraction'

describe('features > banner > naming > titleExtraction', () => {
  it(`handles Aquarell Skyline - Erfurt`, () => {
    const input = [
      'Aquarell Skyline - Erfurt - 01 / 18',
      'Aquarell Skyline - Erfurt - 02 / 18',
      'Aquarell Skyline - Erfurt - 03 / 18',
      'Aquarell Skyline - Erfurt - 04 / 18',
      'Aquarell Skyline - Erfurt - 05 / 18',
      'Aquarell Skyline - Erfurt - 06 / 18',
      'Aquarell Skyline - Erfurt - 07 / 18',
      'Aquarell Skyline - Erfurt - 08 / 18',
      'Aquarell Skyline - Erfurt - 09 / 18',
      'Aquarell Skyline - Erfurt - 10 / 18',
      'Aquarell Skyline - Erfurt - 11 / 18',
      'Aquarell Skyline - Erfurt - 12 / 18',
      'Aquarell Skyline - Erfurt - 13 / 18',
      'Aquarell Skyline - Erfurt - 14 / 18',
      'Aquarell Skyline - Erfurt - 15 / 18',
      'Aquarell Skyline - Erfurt - 16 / 18',
      'Aquarell Skyline - Erfurt - 17 / 18',
      'Aquarell Skyline - Erfurt - 18 / 18',
    ]
    const expected = {
      title: 'Aquarell Skyline - Erfurt',
      total: 18,
      results: [
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '01',
            parsed: 1,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '02',
            parsed: 2,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '03',
            parsed: 3,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '04',
            parsed: 4,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '05',
            parsed: 5,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '06',
            parsed: 6,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '07',
            parsed: 7,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '08',
            parsed: 8,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '09',
            parsed: 9,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '10',
            parsed: 10,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '11',
            parsed: 11,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '12',
            parsed: 12,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '13',
            parsed: 13,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '14',
            parsed: 14,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '15',
            parsed: 15,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '16',
            parsed: 16,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '17',
            parsed: 17,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 28,
            raw: '18',
            parsed: 18,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 33,
            raw: '18',
            parsed: 18,
          },
          titleMarker: { start: 0, raw: 'Aquarell Skyline - Erfurt' },
        },
      ],
    }
    const result = extract(input)
    expect(result).toEqual(expected)
  })
  it(`handles BROGRESS Copenhagen`, () => {
    const input = [
      'BROGRESS Copenhagen 1',
      'BROGRESS Copenhagen 2',
      'BROGRESS Copenhagen 3',
      'BROGRESS Copenhagen 4',
      'BROGRESS Copenhagen 5',
      'BROGRESS Copenhagen 6',
    ]
    const expected = {
      title: 'BROGRESS Copenhagen',
      results: [
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '1',
            parsed: 1,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '2',
            parsed: 2,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '3',
            parsed: 3,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '4',
            parsed: 4,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '5',
            parsed: 5,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 20,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 0, raw: 'BROGRESS Copenhagen' },
        },
      ],
    }
    const result = extract(input)
    expect(result).toEqual(expected)
  })
  it(`handles Sommernachtfilmfestival`, () => {
    const input = [
      'Sommernachtfilmfestival - A1 - Katharinenruine',
      'Sommernachtfilmfestival - A2 - Herrenschießhaus',
      'Sommernachtfilmfestival - A3 - Tucherschloß',
      'Sommernachtfilmfestival - A4 - Egidienkirchhof',
      'Sommernachtfilmfestival - A5 - Pellerhof',
      "Sommernachtfilmfestival - A6 - Krafft'scher Hof",
    ]
    const expected = {
      title: 'Sommernachtfilmfestival',
      results: [
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A1',
            parsed: 1,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A2',
            parsed: 2,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A3',
            parsed: 3,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A4',
            parsed: 4,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A5',
            parsed: 5,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
        {
          missionMarker: {
            type: 'latinLettersArabicNumeralsBase6',
            start: 26,
            raw: 'A6',
            parsed: 6,
          },
          titleMarker: { start: 0, raw: 'Sommernachtfilmfestival' },
        },
      ],
    }
    const result = extract(input)
    expect(result).toEqual(expected)
  })
  it(`handles Visit Requiem Munich - Fürth`, () => {
    const input = [
      '#1 Visit Requiem Munich - Fürth',
      '#2 Visit Requiem Munich - Fürth',
      '#3 Visit Requiem Munich - Fürth',
      '#4 Visit Requiem Munich - Fürth',
      '#5 Visit Requiem Munich - Fürth',
      '#6 Visit Requiem Munich - Fürth',
    ]
    const expected = {
      title: 'Visit Requiem Munich - Fürth',
      results: [
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '1',
            parsed: 1,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '2',
            parsed: 2,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '3',
            parsed: 3,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '4',
            parsed: 4,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '5',
            parsed: 5,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 1,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 3, raw: 'Visit Requiem Munich - Fürth' },
        },
      ],
    }
    const result = extract(input)
    expect(result).toEqual(expected)
  })
  it(`handles Cats in A Row`, () => {
    const input = [
      '[ 1 / 6 ] Cats in A Row',
      '[ 2 / 6 ] Cats in A Row',
      '[ 3 / 6 ] Cats in A Row',
      '[ 4 / 6 ] Cats in A Row',
      '[ 5 / 6 ] Cats in A Row',
      '[ 6 / 6 ] Cats in A Row',
    ]
    const expected = {
      title: 'Cats in A Row',
      total: 6,
      results: [
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '1',
            parsed: 1,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '2',
            parsed: 2,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '3',
            parsed: 3,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '4',
            parsed: 4,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '5',
            parsed: 5,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
        {
          missionMarker: {
            type: 'arabicNumerals',
            start: 2,
            raw: '6',
            parsed: 6,
          },
          totalMarker: {
            type: 'arabicNumerals',
            start: 6,
            raw: '6',
            parsed: 6,
          },
          titleMarker: { start: 10, raw: 'Cats in A Row' },
        },
      ],
    }
    const result = extract(input)
    expect(result).toEqual(expected)
  })
  it(`handles La Petite France (Strasbourg)`, () => {
    const input = [
      'La Petite France (Strasbourg) - 1\\6',
    ]
    const result = extract(input)
    expect(result.title).toEqual('La Petite France (Strasbourg)')
  })
})
