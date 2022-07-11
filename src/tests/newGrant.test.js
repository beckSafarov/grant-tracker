import { sendEmail, sendInvitation } from '../firebase/emailControllers'
import {
  addGrantIfUserExists,
  addGrantToUser,
  setGrantData,
} from '../firebase/grantControllers'
import { setDocData } from '../firebase/helperControllers'
const sampleUserId = 'bifpWrPgnGc42aXPSElmdOpGnVs2' //Robert Smith
/**
  ✅ grantControllers.js -> setGrantData() 
    ✅ helperControllers.js -> setDocData() 
    ✅ grantControllers.js -> addGrantToUser()
  ✅ userControllers.js -> handleCoResearcherEmails()
    ✅ grantControllers.js -> addGrantIfUserExists()
      ✅ grantControllers.js -> addGrantToUser()
    ✅ emailControllers.js -> sendInvitation()
      ✅ emailControllers.js -> sendEmail()
 */

const sampleGrant = {
  type: 'Test',
  title: 'Test Grant',
}

test('invitation to a non existing user', async () => {
  const grant = {
    id: '1',
    startDate: 'today',
    endDate: 'next year today',
    type: 'prg',
  }
  const res = await sendInvitation('becksafari@yandex.com', grant)
  expect(Boolean(res.success)).toBe(true)
})

test('invitation to an existing user', async () => {
  const grant = {
    id: '1',
    type: 'prg',
  }
  const res = await sendInvitation('becksafari@yandex.com', grant, true)
  expect(Boolean(res.success)).toBe(true)
})

test('invitation with missing email', async () => {
  const grant = {
    id: '1',
    type: 'prg',
  }
  const res = await sendInvitation('', grant, true)
  expect(Boolean(res.error)).toBe(true)
})

test('invitation with missing body', async () => {
  const grant = {
    id: '1',
    type: 'prg',
  }
  const res = await sendInvitation('', grant, true)
  expect(Boolean(res.error)).toBe(true)
})

test('sendEmail with all params', async () => {
  const body = {
    message: {
      subject: 'Test',
      text: 'Test',
      html: '<h1>Test Email</h1>',
    },
    to: 'becksafari@yandex.com',
  }
  const res = await sendEmail('test', body)
  expect(Boolean(res.success)).toBe(true)
})

test('sendEmail with undefined body', async () => {
  const res = await sendEmail('test')
  expect(Boolean(res.error)).toBe(true)
})

test('sendEmail with empty {} body', async () => {
  const res = await sendEmail('test', {})
  expect(Boolean(res.error)).toBe(true)
})

test('add Grant if user exists with existing user', async () => {
  const res = await addGrantIfUserExists('smith@gmail.com', sampleGrant)
  expect(res).toBe(true)
})

test('add Grant if user exists with a non existing user', async () => {
  const res = await addGrantIfUserExists('boboro@gmail.com', sampleGrant)
  expect(res).toBe(false)
})

test('add Grant if user exists with no email', async () => {
  const res = await addGrantIfUserExists(undefined, sampleGrant)
  expect(Boolean(res.error)).toBe(true)
})

test('set doc data right params', async () => {
  const res = await setDocData('Grants', 'test_id', sampleGrant)
  expect(res.success).toBe(true)
})

test('set doc data undefined docId', async () => {
  const res = await setDocData('Grants', undefined, sampleGrant)
  expect(Boolean(res.error)).toBe(true)
})

test('set grant data', async () => {
  const res = await setGrantData(sampleGrant)
  expect(res.success).toBe(true)
})

test('add grant to user with user id', async () => {
  const res = await addGrantToUser(sampleGrant, sampleUserId)
  expect(res.success).toBe(true)
})

test('add grant to user with no data', async () => {
  const res = await addGrantToUser(undefined, sampleUserId)
  expect(Boolean(res.error)).toBe(true)
})
