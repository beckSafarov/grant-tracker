import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore/lite'

const firebaseConfig = {
  apiKey: 'AIzaSyAI-sYjZloQnL-IRTqeyWoBWuvau6TeOwc',
  authDomain: 'grant-tracker-9d9ad.firebaseapp.com',
  projectId: 'grant-tracker-9d9ad',
  storageBucket: 'grant-tracker-9d9ad.appspot.com',
  messagingSenderId: '1063880040361',
  appId: '1:1063880040361:web:9b211c503f0285ac34eeb8',
}

export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
