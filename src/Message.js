import {useState,useEffect} from 'react';
import {auth, firestore, firestorage, timestamp} from './config.js';

const Message = (file) => {

    const [progress, setProgress] = useState(0); 
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    
    useEffect(() => {
      // references
      const storageRef = firestorage.ref(file.name);
      const collectionRef = firestore.collection('messages');
      
      storageRef.put(file).on('state_changed', (snap) => {
      let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
      setProgress(percentage);
      }, (err) => {
        setError(err);
      }, async () => {
        const url = await storageRef.getDownloadURL();
        const createdAt = timestamp();
        const { uid, photoURL} = auth.currentUser;
        await collectionRef.add({
          text:'',
          pic:url,
          createdAt,
          uid,
          photoURL
        });
        setUrl(url);
      });
      }, [file]);
  
  return { progress, url, error };
  }

  export default Message;