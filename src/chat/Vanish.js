import React from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useState,useRef} from 'react';
import MessageCall from './MessageCall.js';
import {auth, firestore, timestamp} from '../config.js';
import ChatMessage from './ChatMessage';

function Vanish(props){
    const dummy = useRef();
    const [formValue,setFormValue] = useState('');
    const [file, setFile] = useState(null);
    const types = ['image/png', 'image/jpeg'];

    const vanishRef = firestore.collection('vanishMessages');
    const vanishquery = vanishRef.orderBy('createdAt').limit(25);  
    const [vanishmessages] = useCollectionData(vanishquery, {idField: 'id'});
    
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
          (vanishmessages && vanishmessages.map(msg => <ChatMessage key={msg.id} message={msg} van={props.vanish}/>))
        }
        <span ref={dummy}></span>
      </main>
      <div className="inputBar">    
          <form onSubmit={vanishMessage}> 
              <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="let's begin" required/>
              <label className="inputLabel">
                  <input type="file" onChange={!props.vanish ? handleChange: ''}/>
              </label>
              { file && <MessageCall file={file} setFile={setFile} /> } 
              <button type="submit" disabled={!formValue}>✅</button>
          </form>
      </div>
    </>
  )
} 

export default Vanish;