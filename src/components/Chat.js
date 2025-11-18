import React, { useEffect, useState, useRef } from 'react'; // Aggiunto useRef
// Aggiunte le funzioni doc, getDoc per recuperare il timestamp di uscita
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, doc, getDoc } from 'firebase/firestore'; 
import { auth, db } from '../firebase-config';

const ROOM_SESSIONS_COLLECTION = "roomSessions"; // Deve corrispondere alla collezione in App.js

const Chat = (props) => {
  // Ricevo userId da App.js
  const { room, userId } = props; 

  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [lastExitTime, setLastExitTime] = useState(null); // Timestamp dell'ultima uscita

  // Ref per lo scroll automatico
  const messagesContainerRef = useRef(null); 

  const messageRef = collection(db, "messaggi");


  // 1. useEffect: Recupera il timestamp di uscita all'ingresso nella chat
  useEffect(() => {
    if (!userId || !room) return;

    const userSessionDocRef = doc(db, ROOM_SESSIONS_COLLECTION, userId);

    const fetchExitTime = async () => {
        try {
            const docSnap = await getDoc(userSessionDocRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const timestamp = data[room]; 
                
                if (timestamp) {
                    // Imposta il timestamp (convertito in oggetto Date)
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

  }, [userId, room]); // Si riattiva se cambiano utente o stanza


  // 2. useEffect: Logica per ricevere e mostrare i messaggi (AGGIORNATA PER IL FILTRO)
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
        // Convertiamo il Timestamp di Firestore in un oggetto Date per il confronto
        fetchedMessages.push({ ...data, id: doc.id, createdAt: data.createdAt ? data.createdAt.toDate() : new Date() }); 
      });
      
      // LOGICA DI FILTRO: Mostra solo i messaggi arrivati DOPO l'ultima uscita
      const filteredMessages = lastExitTime
        ? fetchedMessages.filter(msg => msg.createdAt > lastExitTime)
        : fetchedMessages; // Se non c'è timestamp, mostra tutto

      setMessages(filteredMessages);
    });
    
    return () => {
      console.log(`Disiscrizione dal listener Firestore per la stanza: ${room}`);
      unsubscribe();
    }
    
  }, [room, lastExitTime]); // lastExitTime è cruciale per aggiornare il filtro quando arriva


  // 3. useEffect: LOGICA DI AUTO-SCROLL
  useEffect(() => {
    // Forza lo scroll verso il basso ogni volta che i messaggi cambiano
    if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]); 


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
        {/* Contenitore messaggi con altezza fissa e ref per lo scroll */}
        <div
          className='messages'
          ref={messagesContainerRef} // Applico il Ref per lo scroll
          style={{ 
            height: '70vh', // Altezza fissa
            overflowY: 'auto', // Abilita scroll
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
                textAlign: message.user === auth.currentUser.displayName ? 'right' : 'left', 
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
        <form onSubmit={handleSubmit} className='new-message-form'>
          <textarea
            className='new-message-input'
            placeholder='Messaggio...'
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
            rows={1}
            style={{ 
                flexGrow: 1, 
                padding: '10px', 
                marginRight: '10px',
                resize: 'none', 
                minHeight: '40px',
                maxHeight: '150px',
            }}
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
