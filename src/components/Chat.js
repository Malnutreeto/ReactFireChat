import React, { useEffect, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import { auth, db } from '../firebase-config';



const Chat = (props) => {
  //il primo props che mi porto da App.js è room 
  // perchè in addDoc ho bisogno di specificare a che room appartiene il messaggio
  const { room } = props;

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messageRef = collection(db, "messaggi");

  //dico a firebase di ricevere e mostrare i messaggi provenienti da altro utente nella stessa chatroom
  useEffect(() => {
    const queryMessages = query(
      messageRef,
      where("room", "==", room),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id })
      });
      setMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage === "") return;

    //comunico a Firebase tutte le informazioni relative al messaggio
    await addDoc(messageRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: room
    });

    //setto nuovamente l'input vuoto dopo l'invio del messaggio 
    setNewMessage("")
  };


  return (
    <div className='container'>
      <div className='chat-app'>
        <div className='header'>
          Welcome to: {room.toUpperCase()}
        </div>
        <div
          className='messages'>
          {messages.map((message) => (
            <div
              className='message' key={message.id}>
              <span className='user'>
                {message.user}:
              </span>
              <span>
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} >
          <input
            className='new-message-input'
            placeholder='Messaggio...'
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button type='submit' className='send-button'>
            Invia
          </button>
        </form>
      </div>
    </div>

  )
}

export default Chat;