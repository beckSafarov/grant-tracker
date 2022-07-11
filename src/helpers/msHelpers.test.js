import produce from 'immer'
import { msDatesValidated } from './msHelpers'

const getToDate = (d) => ({ toDate: () => new Date(d) })

const sample = {
  startDate: new Date('06-18-2022'),
  endDate: new Date('06-29-2022'),
  grant: {
    startDate: getToDate('05-18-2022'),
    endDate: getToDate('05-18-2024'),
    milestones: [
      {
        id: '1',
        startDate: new Date('05-25-2022'),
        endDate: new Date('06-15-2022'),
      },
    ],
  },
}

const buildPeriodTestCase = (desc, endDate, expected) => ({
  desc,
  param: { ...sample, endDate: new Date(endDate) },
  expected,
})

// previous: {ends: '06-15-2022'}
const buildClashWithPrev = (startDate) => ({
  ...sample,
  startDate,
})

const clashWithnext = () =>
  produce(sample, (draft) => {
    draft.id = '2'
    draft.startDate = new Date('06-16-2022')
    draft.endDate = new Date('07-02-2022')
    draft.grant.milestones = [
      ...draft.grant.milestones,
      {
        id: '2',
        startDate: new Date('06-16-2022'),
        endDate: new Date('06-27-2022'),
      },
      {
        id: '3',
        startDate: new Date('07-01-2022'),
        endDate: new Date('07-15-2022'),
      },
    ]
  })

const noClashWithNext = () =>
  produce(sample, (draft) => {
    draft.id = '2'
    draft.startDate = new Date('06-16-2022')
    draft.endDate = new Date('07-02-2022')
    draft.grant.milestones = [
      ...draft.grant.milestones,
      {
        id: '2',
        startDate: new Date('06-16-2022'),
        endDate: new Date('06-27-2022'),
      },
      {
        id: '3',
        startDate: new Date('07-03-2022'),
        endDate: new Date('07-15-2022'),
      },
    ]
  })

const cases = [
  buildPeriodTestCase('less than 10 days interval', '06-25-2022', false),
  buildPeriodTestCase('10 days interval', '07-03-2022', true),
  buildPeriodTestCase('more than 10 days interval', '07-05-2022', true),
  {
    desc: 'clash with the previous milestone',
    param: buildClashWithPrev('06-14-2022'),
    expected: false,
  },
  {
    desc: 'same day as the previous ends',
    param: buildClashWithPrev('06-15-2022'),
    expected: true,
  },
  {
    desc: 'clash with the next milestone',
    param: clashWithnext(),
    expected: false,
  },
  {
    desc: 'no clash with the next milestone',
    param: noClashWithNext(),
    expected: true,
  },
  buildPeriodTestCase('starts before the grant starts', '06-22-2022', false),
  buildPeriodTestCase('ends after the grant ends', '06-25-2024', false),
]

const methodWrapper = (param) => msDatesValidated(param).success

for (let currCase of cases) {
  test(currCase.desc, () => {
    expect(methodWrapper(currCase.param)).toBe(currCase.expected)
  })
}

test('undefined data passed', () => {
  expect(() => msDatesValidated()).toThrow()
})

test('empty object passed', () => {
  expect(() => msDatesValidated({})).toThrow()
})

test('no startDate passed', () => {
  expect(() => msDatesValidated({ startDate: '1', grant: '2' })).toThrow()
})

test('no grant passed', () => {
  expect(() => msDatesValidated({ startDate: '1', endDate: '2' })).toThrow()
})