import React, { useEffect, useState, useRef } from 'react'; 
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDoc } from 'firebase/firestore'; 
import { db } from '../firebase-config';

const ROOM_SESSIONS_COLLECTION = "roomSessions"; 

const Chat = (props) => {
  // Takes userNick from App.js
  const { room, userNick } = props; 

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastExitTime, setLastExitTime] = useState(null);

  // automated scroll Ref
  const messagesContainerRef = useRef(null); 

  const messageRef = collection(db, "messages");

  useEffect(() => {
    if (!userNick || !room) return;

    const userSessionDocRef = doc(db, ROOM_SESSIONS_COLLECTION, userNick);

    const fetchExitTime = async () => {
        try {
            const docSnap = await getDoc(userSessionDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const timestamp = data[room]; 

                if (timestamp) {

                  setLastExitTime(timestamp.toDate()); 
                } else {
                    setLastExitTime(null);
                }
            } else {
                setLastExitTime(null);
            }
        } catch (error) {
            console.error("Errore nel recupero del timestamp di uscita:", error);
            setLastExitTime(null);
        }
    };

    fetchExitTime();

  }, [userNick, room]); 


  useEffect(() => {
    if (!room) {
      setMessages([]);
      return;
    }

    const queryMessages = query(
      messageRef,
      where("room", "==", room),
      orderBy("createdAt")
    );

    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let fetchedMessages = [];
      snapshot.forEach((doc) => {
        const data = doc.data();

        fetchedMessages.push({ ...data, id: doc.id, createdAt: data.createdAt ? data.createdAt.toDate() : new Date() }); 
      });

      const filteredMessages = lastExitTime
        ? fetchedMessages.filter(msg => msg.createdAt > lastExitTime)
        : fetchedMessages; 

      setMessages(filteredMessages);
    });

    return () => {
      console.log(`Disiscrizione dal listener Firestore per la stanza: ${room}`);
      unsubscribe();
    }

  }, [room, lastExitTime]); 


  useEffect(() => {
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); 


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageToSend = newMessage;
    setNewMessage("");

    try {
        await addDoc(messageRef, {
            text: messageToSend,
            createdAt: serverTimestamp(),
            user: userNick,
            room: room
        });
    } catch (error) {
        console.error("Error sending message:", error);
        setNewMessage(messageToSend); 
        alert("Error sending message, please try again.");
    }
  };


  return (
    <div className='container'>
      <div className='chat-app'>
        <div className='header'>
          Welcome to: {room.toUpperCase()}
        </div>
        <div
          className='messages'
          ref={messagesContainerRef}
          style={{ 
            height: '70vh',
            overflowY: 'auto',
            padding: '10px',
            border: '1px solid #ccc',
            marginBottom: '10px'
          }}
        >
          {messages.map((message) => (
            <div
              className='message' 
              key={message.id}
              style={{
                textAlign: message.user === userNick ? 'right' : 'left', 
                padding: '5px',
              }}
            >
              <span className='user' style={{ fontWeight: 'bold', color: '#6366f1' }}>
                {message.user}:
              </span>
              <span>
                {message.text}
              </span>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex' }}>
          <textarea
             className='new-message-input'
            placeholder='Messaggio...'
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button type='submit' className='send-button' style={{ padding: '10px 15px' }}>
            Invia
          </button>
        </form>
      </div>
    </div>

  )
}

export default Chat;
