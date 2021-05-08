import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useState,useRef} from 'react';
import guest from './Guest.jpg';

firebase.initializeApp({
  apiKey: "AIzaSyDND-dmmQrfjiEavJEPiuWVAi6MDnz1W1c",
  authDomain: "firechat-cbc9b.firebaseapp.com",
  projectId: "firechat-cbc9b",
  storageBucket: "firechat-cbc9b.appspot.com",
  messagingSenderId: "502352256377",
  appId: "1:502352256377:web:d6103f66d7642e791963a8"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function clearCollection(path) {
  const ref = firestore.collection(path)
  ref.onSnapshot((snapshot) => {
    snapshot.docs.forEach((doc) => {
      ref.doc(doc.id).delete()
    })
  })
}

function App() {
  const [user] = useAuthState(auth);
  const[vanishOn,setVanishOn] = useState(false);
  
  const vanish = () => {
    console.log('before pressing : '+vanishOn);
    if(vanishOn){
      clearCollection('vanishMessages');
      setVanishOn(false);
    } 
    else{
      setVanishOn(true);
    } 
    console.log('after pressing : '+vanishOn);
  } 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firechat</h1>
        {
          user ? <button className="vanish" onClick={vanish}>
            {vanishOn ? 'Exit Vanish Mode' : 'Enter Vanish Mode'}</button> : ''
        }
        <SignOut/>
      </header>
      <section className={`Section ${vanishOn ? 'darkbody' : ''}`}>
        {
          user ? <Chatroom vanish={vanishOn}/> : <SignIn/>
        }
      </section>
    </div>
  );
}

function SignIn()
{
  const signInWithEmail = () => {
    clearCollection('vanishMessages');
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => alert(error.message)); 
  }
  return (
    <button onClick={signInWithEmail}>Sign In With Email</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function Chatroom(props){
  const dummy = useRef();
  
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(25);
  const [messages] = useCollectionData(query, {idField: 'id'});

  const vanishRef = firestore.collection('vanishMessages');
  const vanishquery = vanishRef.orderBy('createdAt').limit(25);  
  const [vanishmessages] = useCollectionData(vanishquery, {idField: 'id'});

  const [formValue,setFormValue] = useState('');
  
  const sendMessage = async(e) => {
    e.preventDefault();
    const { uid, photoURL} = auth.currentUser;
    await messageRef.add({
        text:formValue,
        createdAt:firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL
      });
    
      setFormValue('');
      dummy.current.scrollIntoView({behavior:'smooth'});
    }
  
  const vanishMessage = async(e) => {
      e.preventDefault();
      const { uid, photoURL} = auth.currentUser;
      await vanishRef.add({
          text:formValue,
          createdAt:firebase.firestore.FieldValue.serverTimestamp(),
          uid,
          photoURL
        });
      
        setFormValue('');
        dummy.current.scrollIntoView({behavior:'smooth'});
      }

  return (
    <>
      <main>
        {
            props.vanish ? 
            (vanishmessages && vanishmessages.map(msg => <ChatMessage key={msg.id} message={msg} van={props.vanish}/>)):
            (messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} van={props.vanish} />))
        }
        <span ref={dummy}></span>
      </main>
      <form onSubmit={props.vanish ? vanishMessage : sendMessage}>
            <input value={formValue} 
              onChange={(e) => setFormValue(e.target.value)} 
              placeholder="say something nice" />
            <button type="submit" disabled={!formValue}>🕊️</button>
      </form>
    </>
  )
} 

function ChatMessage(props){
  const {text, uid, photoURL } =props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL || guest} alt="Guest"/>
      <p className={`para ${props.van ? 'dark' : ''}`}>{text}</p>
    </div>
  )
}


export default App;
