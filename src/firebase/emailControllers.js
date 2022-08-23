import { v4 as uuid4 } from 'uuid'
import { grantOptions } from '../config'
import { getToken, isAnyNone } from '../helpers'
import { getDataById, setDocData } from './helperControllers'
import * as template from './emailTemplates'
const loc =
  process.env.NODE_ENV === 'test'
    ? 'http://localhost:3000'
    : window?.location?.origin

const getMissingErr = (first, second) => {
  return {
    error: `${first} or ${second} is  missing or does not contain a value`,
  }
}

/**
 * @desc compares the given email with the existing emails for the status
 */
const compareEmails = async ({ email, school, status }) => {
  const data = await getDataById('Emails', school)
  return data[status] === email
}

/**
 * @type confirmation|invitation
 * @body {
 *  message: {
      subject: 'Welcome to Firebase',
      text: 'Welcome to Firebase',
      html: '<h1>Hi Mom!</h1>',
    },
    to: 'johnDoe@Example.com',
  }
 */
const sendEmail = async (type, body) => {
  if (isAnyNone([type, body])) {
    return getMissingErr('type', 'body')
  }
  const id = type + '-' + uuid4()
  try {
    const res = await setDocData('Email', id, body)
    return { ...res, id }
  } catch (error) {
    return { error }
  }
}

const sendToken = async (email) => {
  const token = getToken()
  const { id } = await sendEmail('confirmation-token', {
    message: {
      subject: 'Confirmation Token',
      text: 'Your GTrack token',
      html: template.TokenConfirmation(token),
    },
    token,
    to: email,
  })
  return { token, id }
}

/**
 * @email email of the recipient
 * @grant {type, piName}
 */
const grantInviteExistingUser = async (email, grant) => {
  const grantName = grantOptions[grant.type]
  const link = `${loc}/login`
  try {
    return await sendEmail('grant-invitation', {
      message: {
        subject: 'Invitation to a Grant',
        text: 'You are invited to a Grant',
        html: template.ExistingUserGrantInv({
          grantName,
          piName: grant.piName,
          link,
        }),
      },
      to: email,
    })
  } catch (error) {
    return { error }
  }
}

/**
 * @email email of the recipient
 * @grant {id, startDate, endDate, type, piName}
 */
const grantInviteNonExistingUser = async (email, grant) => {
  const { id, startDate, endDate, type, piName } = grant
  const link = `${loc}/signup?grantId=${id}&email=${email}&startDate=${startDate}&endDate=${endDate}&type=${type}`
  const grantName = grantOptions[grant.type]
  try {
    return await sendEmail('grant-invitation', {
      message: {
        subject: 'Invitation to a Grant',
        text: 'You are invited to a Grant in USM',
        html: template.NonExistingUserGrantInv({
          grantName,
          piName,
          link,
        }),
      },
      to: email,
    })
  } catch (error) {
    return { error }
  }
}

/**
 * @grant Obj {id, type, startDate, endDate, piName}
 */
const sendInvitation = async (email, grant, isExistingUser) => {
  if (isAnyNone([email, grant])) {
    return getMissingErr('email', 'grant')
  }
  return isExistingUser
    ? grantInviteExistingUser(email, grant)
    : grantInviteNonExistingUser(email, grant)
}

const compareTokens = async (token, id) => {
  try {
    const email = await getDataById('Email', id)
    return email.token === token
  } catch (error) {
    return { error }
  }
}

export { compareEmails, sendEmail, sendToken, compareTokens, sendInvitation }
