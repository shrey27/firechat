import React from 'react';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import {useState,useRef} from 'react';
import MessageCall from './MessageCall.js';
import {auth, firestore, timestamp} from '../config.js';
import ChatMessage from './ChatMessage';

function Chatroom(props){
    const dummy = useRef();
    const [formValue,setFormValue] = useState('');
    const [file, setFile] = useState(null);
    const types = ['image/png', 'image/jpeg'];
    const messageRef = firestore.collection('messages');
    const query = messageRef.orderBy('createdAt').limit(25);
    const [messages] = useCollectionData(query, {idField: 'id'});
    
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
          (messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} van={props.vanish} />))
        }
        <span ref={dummy}></span>
      </main>
      <div className="inputBar">    
          <form onSubmit={sendMessage}> 
              <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="let's begin" required/>
              <label className="inputLabel">
                  <input type="file" onChange={!props.vanish ? handleChange: ''}/>
                  <span>⏏️</span>
              </label>
              { file && <MessageCall file={file} setFile={setFile} /> } 
              <button type="submit" disabled={!formValue}>✅</button>
          </form>
      </div>
    </>
  )
} 

export default Chatroom;