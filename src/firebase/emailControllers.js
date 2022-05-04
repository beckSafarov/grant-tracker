import { v4 as uuid4 } from 'uuid'
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

const compareTokens = async (token, id) => {
  const email = await getDataById('Email', id)
  return email.token === token
}

export { compareEmails, sendEmail, sendToken, compareTokens }
