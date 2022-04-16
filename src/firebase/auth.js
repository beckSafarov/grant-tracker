import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { app } from './config'

const auth = getAuth(app)

const handleAuthSuccess = ({ user }) => {
  return { success: true, user }
}

const handleError = (error) => ({
  errorCode: error.code,
  errorMessage: error.message,
})

const emailSignUp = ({ email, password }) =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(handleAuthSuccess)
    .catch(handleError)

/**
 * @desc login
 */
const emailSignIn = ({ email, password }) =>
  signInWithEmailAndPassword(auth, email, password)
    .then(handleAuthSuccess)
    .catch(handleError)

const getUserAuth = () => {
  if (auth.currentUser) return auth.currentUser
  let user = null
  onAuthStateChanged(auth, (u) => {
    user = u || false
  })
  return user
}

const logout = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (err) {
    return err
  }
}

export { emailSignUp, emailSignIn, getUserAuth, logout }
