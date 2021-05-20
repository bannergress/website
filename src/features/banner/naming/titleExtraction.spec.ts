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
    const input = ['La Petite France (Strasbourg) - 1\\6']
    const result = extract(input)
    expect(result.title).toEqual('La Petite France (Strasbourg)')
  })
  it(`handles 清院本清明上河圖`, () => {
    const input = ['清院本清明上河圖1151', '清院本清明上河圖1152']
    const result = extract(input)
    expect(result.results[0].missionMarker?.parsed).toEqual(1151)
  })
  it(`handles West 300 Tour`, () => {
    const input = new Array(60)
      .fill(0)
      .map(
        (unused, index) =>
          `West 300 Tour ${String(index + 1).padStart(2, '0')}/60`
      )
    const result = extract(input)
    expect(result.title).toEqual('West 300 Tour')
  })
  it(`handles #MP COVID-19 Theme Prague, Czech Republic`, () => {
    const input = new Array(6)
      .fill(0)
      .map(
        (unused, index) =>
          `#MP COVID-19 Theme ${index + 1}/6 Prague, Czech Republic`
      )
    const result = extract(input)
    expect(result.total).toEqual(6)
    expect(result.title).toEqual('#MP COVID-19 Theme / Prague, Czech Republic')
  })
  it(`handles Treuchtlingen Nr. 1`, () => {
    const input = new Array(6)
      .fill(0)
      .map((unused, index) => `Treuchtlingen Nr. ${index + 1}`)
    const result = extract(input)
    expect(result.title).toEqual('Treuchtlingen')
  })
  it(`handles MD 2019: Nuremberg`, () => {
    const input = [
      'MD 2019: Nuremberg, Haller Castle',
      'MD 2019: Nuremberg, Imperial Castle',
      'MD 2019: Nuremberg, Inn Brewery Altstadthof',
    ]
    const result = extract(input)
    expect(result.title).toEqual('MD 2019: Nuremberg')
  })
  it(`handles Source des Célestins`, () => {
    const input = new Array(60)
      .fill(0)
      .map(
        (unused, index) =>
          `${String(index + 1).padStart(2, '0')} - Source des Célestins`
      )
    const result = extract(input)
    expect(result.title).toEqual('Source des Célestins')
  })
  it(`handles Breda de Vesting`, () => {
    const input = ['1 Breda de Vesting']
    const result = extract(input)
    expect(result.title).toEqual('Breda de Vesting')
  })
  it(`handles Bamberger Dom`, () => {
    const input = [
      'Bamberger Dom - I Altes Rathaus',
      'Bamberger Dom - II Klosterbräu',
      'Bamberger Dom - III St. Stephan',
      'Bamberger Dom - IV Kaulberg',
      'Bamberger Dom - V Domgrund',
      'Bamberger Dom - VI Dom',
      'Bamberger Dom - VII Alte Hofhaltung',
      'Bamberger Dom - VIII Elisabethenkirche',
      'Bamberger Dom - IX Der Sand',
      'Bamberger Dom - X Corner Madonna',
      'Bamberger Dom - XI Die schöne Rubina',
      'Bamberger Dom - XII Die Häuser',
      'Bamberger Dom - XIII Well in Concordia',
      'Bamberger Dom - XIV Portalquelle',
      'Bamberger Dom - XV Domverwaltung',
      'Bamberger Dom - XVI Tattermannsäule',
      'Bamberger Dom - XVII Domplatz',
      'Bamberger Dom - XVIII Elisabethenkirche',
      'Bamberger Dom - XIX Schlenkerla',
      'Bamberger Dom - XX Karolinenstr.',
      'Bamberger Dom - XXI Schranne',
      'Bamberger Dom - XXII Böttingerhaus',
      'Bamberger Dom - XXIII Concordia',
      'Bamberger Dom - XXIV Portalquelle',
      'Bamberger Dom - XXV Domverwaltung',
      'Bamberger Dom - XXVI Bamberger Reiter',
      'Bamberger Dom - XXVII Domdämon',
      'Bamberger Dom - XXVIII Ottoplatz',
      'Bamberger Dom - XXIX Sandstraße',
      'Bamberger Dom - XXX Madonna',
    ]
    const result = extract(input)
    expect(result).toEqual({
      results: [
        {
          missionMarker: {
            parsed: 1,
            raw: 'I',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 2,
            raw: 'II',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 3,
            raw: 'III',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 4,
            raw: 'IV',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 5,
            raw: 'V',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 6,
            raw: 'VI',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 7,
            raw: 'VII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 8,
            raw: 'VIII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 9,
            raw: 'IX',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 10,
            raw: 'X',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 11,
            raw: 'XI',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 12,
            raw: 'XII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 13,
            raw: 'XIII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 14,
            raw: 'XIV',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 15,
            raw: 'XV',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 16,
            raw: 'XVI',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 17,
            raw: 'XVII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 18,
            raw: 'XVIII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 19,
            raw: 'XIX',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 20,
            raw: 'XX',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 21,
            raw: 'XXI',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 22,
            raw: 'XXII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 23,
            raw: 'XXIII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 24,
            raw: 'XXIV',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 25,
            raw: 'XXV',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 26,
            raw: 'XXVI',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 27,
            raw: 'XXVII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 28,
            raw: 'XXVIII',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 29,
            raw: 'XXIX',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
        {
          missionMarker: {
            parsed: 30,
            raw: 'XXX',
            start: 16,
            type: 'romanNumerals',
          },
          titleMarker: { raw: 'Bamberger Dom', start: 0 },
          totalMarker: undefined,
        },
      ],
      title: 'Bamberger Dom',
      total: undefined,
    })
  })
})
