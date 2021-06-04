import React, { useEffect } from 'react';
import firebase from 'firebase/app';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useState} from 'react';
import {auth, firestore} from './config.js';
import Chatroom from './chat/Chatroom';
import Vanish from './chat/Vanish';

function App() {
  const [user] = useAuthState(auth);
  const[vanishOn,setVanishOn] = useState(false);
  
  const clearCollection = async() => {
    
    const ref = firestore.collection('vanishMessages');
    await ref.get().then(data => {
      console.log('Clearing');
      data.forEach(doc => { doc.ref.delete(); })
    });
  }

  useEffect(() => {
    clearCollection();
  })

  const vanish = () => {
    if(vanishOn){
      //clearCollection();
      setVanishOn(false);
    } 
    else{
      setVanishOn(true);
    } 
  } 

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firechat</h1>
        {
          user ? 
          <button className="vanish" onClick={vanish}>
          {vanishOn ? 'Exit Vanish Mode' : 'Enter Vanish Mode'}</button> : ''
        }
        <SignOut/>
      </header>
      <section className={`Section ${vanishOn ? 'darkbody' : ''}`}>
        {
          user ? (
                    vanishOn ? <Vanish vanish={vanishOn}/> : <Chatroom vanish={vanishOn}/>
                  )
             : <SignIn/>
        }
      </section>
    </div>
  );
}

function SignIn()
{
    const signInWithEmail = () => {
    var provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => alert(error.message)); 
  }
  return (
    <button onClick={signInWithEmail}>Sign In With Gmail</button>
  )
}

function SignOut(){
  return auth.currentUser && (
    <button onClick={() => auth.signOut()}>Sign Out</button>
  )
}

export default App;
