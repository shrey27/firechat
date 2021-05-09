import { useEffect } from 'react';
import Message from './Message.js';

const MessageCall = ({file, setFile}) => {

    const { url } = Message(file);
  
    useEffect(() => {
      if (url) {
        setFile(null);
      }
    }, [url, setFile]);
  
    return (
        <>
        </>
    );
  
  }

  export default MessageCall;