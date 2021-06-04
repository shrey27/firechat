import React from 'react';
import guest from './Guest.jpg';
import {auth} from '../config.js';

function ChatMessage(props){
    const {text, uid, pic, photoURL } =props.message;
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'recieved';
    
    return (
      <div className={`message ${messageClass}`}>
        <img className="profilepic" src={photoURL || guest} alt="Guest"/>
        {/* { text && <p className={`para ${props.van ? 'dark' : ''}`}>{text}</p> } */}
        { text && <p className='para'>{text}</p> }
        { pic && <img className="sharedpic" src={pic} alt="shared" style={{ width:'50vh' , height:'50vh'}}/> }
      </div>
    )
  }

export default ChatMessage;