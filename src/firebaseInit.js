import { firebase } from '@firebase/app'
import '@firebase/firestore'
import 'firebase/auth'

var firebaseConfig = {
  apiKey: "AIzaSyCwGjUEWdamhOGO9s-sBQNRrq_-HeKE0fo",
  authDomain: "step-by-step-a293b.firebaseapp.com",
  databaseURL: "https://step-by-step-a293b.firebaseio.com",
  projectId: "step-by-step-a293b",
  storageBucket: "step-by-step-a293b.appspot.com",
  messagingSenderId: "497055751917",
  appId: "1:497055751917:web:c19523a52bb540e92f76e4"
}
// Initialize Firebase
firebase.initializeApp(firebaseConfig)

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)

export const db = firebase.firestore()
export const auth = firebase.auth()


