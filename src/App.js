import React from 'react';
import firebase from 'firebase/app';
import './App.css';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useState,useRef} from 'react';
import guest from './Guest.jpg';
import MessageCall from './MessageCall.js';
import {auth, firestore, timestamp} from './config.js';

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
    if(vanishOn){
      clearCollection('vanishMessages');
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
      {user ? <StatusBar/> : ''}
      <section className={`Section ${vanishOn ? 'darkbody' : ''}`}>
        {
          user ? <Chatroom vanish={vanishOn}/> : <SignIn/>
        }
      </section>
    </div>
  );
}

function StatusBar() {

  const {displayName, photoURL} = auth.currentUser;
  return(
    <div className='StatusBar'>
      <div>
        <img src = {photoURL} alt="Profile Pic"/>
        {/* <section> */}
        <p>{displayName}</p>
        <h6>Online</h6>
        {/* </section> */}
      </div>
    </div>
  )
}

function SignIn()
{
  const signInWithEmail = () => {
    //clearCollection('vanishMessages');
    var provider = new firebase.auth.GoogleAuthProvider();
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

    const [formValue,setFormValue] = useState('');
    const [file, setFile] = useState(null);
    //const [url,setUrl] = useState('');
      
    const types = ['image/png', 'image/jpeg'];
    
    const messageRef = firestore.collection('messages');
    const query = messageRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, {idField: 'id'});

    const vanishRef = firestore.collection('vanishMessages');
    const vanishquery = vanishRef.orderBy('createdAt').limit(25);  
    const [vanishmessages] = useCollectionData(vanishquery, {idField: 'id'});

    const sendMessage = async(e) => { 
      e.preventDefault();
      const { uid, photoURL} = auth.currentUser;
      await messageRef.add({
          text:formValue,
          createdAt:timestamp(),
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
            createdAt:timestamp(),
            uid,
            photoURL
          });      
      setFormValue('');
      dummy.current.scrollIntoView({behavior:'smooth'});
      }
  
    const handleChange = (e) => {
      let selected = e.target.files[0];
      if (selected && types.includes(selected.type)) {
        setFile(selected);
      } else {
        setFile(null);
      }
    };

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
      <div className="inputBar">    
          <form onSubmit={props.vanish ? vanishMessage : sendMessage}> 
              <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="let's begin" />
              <label className="inputLabel">
                  <input type="file" onChange={!props.vanish ? handleChange: ''}/>
                  <span>{props.vanish ? '❌' : '⏏️'}</span>
              </label>
              { file && <MessageCall file={file} setFile={setFile} /> } 
              <button type="submit" disabled={!formValue}>✅</button>
          </form>
      </div>
    </>
  )
} 

function ChatMessage(props){
  const {text, uid, pic, photoURL } =props.message;
  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
  
  return (
    <div className={`message ${messageClass}`}>
      <img className="profilepic" src={photoURL || guest} alt="Guest"/>
      { text && <p className={`para ${props.van ? 'dark' : ''}`}>{text}</p> }
      { pic && <img className="sharedpic" src={pic} alt="shared" style={{ width:'50vh' , height:'50vh'}}/> }
    </div>
  )
}

export default App;
