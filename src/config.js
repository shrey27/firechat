import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

firebase.initializeApp({
    apiKey: "AIzaSyDND-dmmQrfjiEavJEPiuWVAi6MDnz1W1c",
    authDomain: "firechat-cbc9b.firebaseapp.com",
    projectId: "firechat-cbc9b",
    storageBucket: "firechat-cbc9b.appspot.com",
    messagingSenderId: "502352256377",
    appId: "1:502352256377:web:d6103f66d7642e791963a8"
  })

const auth = firebase.auth();
const firestorage = firebase.storage();
const firestore = firebase.firestore();
const timestamp = firebase.firestore.FieldValue.serverTimestamp;

export { auth,firestorage, firestore, timestamp };