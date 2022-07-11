import {
  getCoResearcherGrantData,
  handleCoResearcherEmails,
} from '../firebase/userControllers'
const ruTeamGrant = {
  type: 'ruTeam',
  id: 'sample_id',
  startDate: new Date(),
  endDate: new Date(),
  info: {
    projects: [
      { coResearcherEmail: 'weewfew@gmail.com' },
      { coResearcherEmail: '23e3dwd@gmail.com' },
      { coResearcherEmail: 'ew32@gmail.com' },
      { coResearcherEmail: 'wef23wq@gmail.com' },
    ],
  },
}
const regularGrant = {
  type: 'short',
  id: 'sample_id',
  startDate: new Date(),
  endDate: new Date(),
  info: { coResearcherEmail: 'becksafari@yandex.com' },
}

test('getCoResearcherGrantData: undefined grant', async () => {
  expect(() =>
    getCoResearcherGrantData(undefined, {
      name: 'Beck Safarov',
    })
  ).toThrow()
})

test('getCoResearcherGrantData: missing user', async () => {
  expect(() => getCoResearcherGrantData({ s: 's' }, undefined)).toThrow()
})

test('getCoResearcherGrantData: regular grant', async () => {
  const res = getCoResearcherGrantData(regularGrant, { name: 'Beck Safarov' })
  expect(res).toEqual({
    emails: ['becksafari@yandex.com'],
    dataToDB: { ...regularGrant, researcherStatus: 'coResearcher' },
    dataToEmail: {
      ...regularGrant,
      startDate: regularGrant.startDate.getTime(),
      endDate: regularGrant.endDate.getTime(),
      piName: 'Beck Safarov',
    },
  })
})

test('getCoResearcherGrantData: ru grant', async () => {
  const res = getCoResearcherGrantData(ruTeamGrant, { name: 'Beck Safarov' })
  expect(res).toEqual({
    emails: ruTeamGrant.info.projects.map(
      (project) => project.coResearcherEmail
    ),
    dataToDB: { ...ruTeamGrant, researcherStatus: 'coResearcher' },
    dataToEmail: {
      ...ruTeamGrant,
      startDate: ruTeamGrant.startDate.getTime(),
      endDate: ruTeamGrant.endDate.getTime(),
      piName: 'Beck Safarov',
    },
  })
})

test('handleCoResearcherEmails: undefined grant', async () => {
  const user = { name: 'Alfred Robkin' }
  const res = await handleCoResearcherEmails(undefined, user)
  expect(Boolean(res.error)).toBe(true)
})
test('handleCoResearcherEmails: empty {} grant', async () => {
  const user = { name: 'Alfred Robkin' }
  const res = await handleCoResearcherEmails({}, user)
  expect(Boolean(res.error)).toBe(true)
})

test('handleCoResearcherEmails: undefined user', async () => {
  const res = await handleCoResearcherEmails(ruTeamGrant, undefined)
  expect(Boolean(res.error)).toBe(true)
})

test('handleCoResearcherEmails: ru team grant', async () => {
  const user = { name: 'Alfred Robkin' }
  const res = await handleCoResearcherEmails(ruTeamGrant, user)
  expect(Boolean(res.success)).toBe(true)
})

test('handleCoResearcherEmails: short term', async () => {
  const user = { name: 'Alfred Robkin' }
  const res = await handleCoResearcherEmails(regularGrant, user)
  expect(Boolean(res.success)).toBe(true)
})
