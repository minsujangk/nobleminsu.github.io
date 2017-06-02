import Firebase from 'firebase'

const firebaseApp = Firebase.initializeApp({
  apiKey: 'AIzaSyBWyjl0go31JN8q_ol_9q9rCNbDFHCyhzA',
  authDomain: 'sagam-ba36f.firebaseapp.com',
  databaseURL: 'https://sagam-ba36f.firebaseio.com',
  projectId: 'sagam-ba36f',
  storageBucket: 'sagam-ba36f.appspot.com',
  messagingSenderId: '716070640170'
})

export const db = firebaseApp.database()
