import { v4 as uuid4 } from 'uuid'
import { grantOptions, ROOT } from '../config'
import { getToken } from '../helpers'
import { getDataById, setDocData } from './controllers'

/**
 * @desc compares the given email with the existing emails for the status
 */
const compareEmails = async ({ email, school, status }) => {
  const data = await getDataById('Emails', school)
  return data[status] === email
}

/**
 * sample format: 
 * message: {
      subject: 'Welcome to Firebase',
      text: 'Welcome to Firebase',
      html: '<h1>Hi Mom!</h1>',
    },
    to: 'begzodsafarov@student.usm.my',
 */
const sendEmail = async (type, body) => {
  const id = type + '-' + uuid4()
  await setDocData('Email', id, body)
  return id
}

const sendToken = async (email) => {
  const token = getToken()
  const id = await sendEmail('confirmation-token', {
    message: {
      subject: 'Confirmation Token',
      text: 'Your GTrack token',
      html: `
      <centered>
        <p style='margin-bottom: 20px'>The below is your confirmation token for Grant Tracker web application. </p>
        <h1 style='text-align:center'>${token}</h1>
      </centered>`,
    },
    token,
    to: email,
  })
  return { token, id }
}

const grantInviteExistingUser = async (email, grant) => {
  const grantName = grantOptions[grant.type]
  const link = `${ROOT} + /login`
  const id = await sendEmail('grant-invitation', {
    message: {
      subject: 'Invitation to a Grant',
      text: 'You are invited to a Grant',
      html: `
        <centered>
            <p>This is to inform you that you have been invited as a co-researcher to <strong>${grantName}</strong> grant by <strong>${grant.piName}</strong> at <strong>Universiti Sains Malaysia</strong>. <a href=${link}>Log in</a> to your account if you have not already to access the grant dashboard.</p>
          </centered>
      `,
    },
    to: email,
  })
  return { id }
}

const grantInviteNonExistingUser = async (email, grant) => {
  const link = `${ROOT}/signup?grantId=${grant.id}&email=${email}&startDate=${grant.startDate}&endDate=${grant.endDate}&type=${grant.type}`
  const grantName = grantOptions[grant.type]
  const id = await sendEmail('grant-invitation', {
    message: {
      subject: 'Invitation to a Grant',
      text: 'You are invited to a Grant in USM',
      html: `
        <centered>
          <p>This is to inform you that you have been invited as a co-researcher for <strong>${grantName}</strong> grant by <strong>${grant.piName}</strong> at <strong>Universiti Sains Malaysia</strong>. Follow the link below to activate your account and access the dashboard.</p>
          <div style="margin-top: 20px;">
            <a href=${link}>${link}</a>
          </div>
        </centered>
      `,
    },
    to: email,
  })
  return { id }
}

/**
 * @grant Obj {id, type, startDate, endDate, piName}
 */
const sendInvitation = async (email, grant, isExistingUser) => {
  return isExistingUser
    ? grantInviteExistingUser(email, grant)
    : grantInviteNonExistingUser(email, grant)
}

const compareTokens = async (token, id) => {
  const email = await getDataById('Email', id)
  return email.token === token
}

export { compareEmails, sendEmail, sendToken, compareTokens, sendInvitation }
