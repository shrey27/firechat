import { useEffect } from 'react';
import Message from './Message.js';

const MessageCall = ({file, setFile}) => {

    const { progress, url } = Message(file);
  
    useEffect(() => {
      if (url) {
        setFile(null);
      }
    }, [url, setFile]);
  
    return (
        <div className="progress-bar"
          initial={{ width: 0 }}
          animate={{ width: progress + '%' }}
        ></div>
    );
  
  }

  export default MessageCall;