import React, { useRef, useState } from 'react';
import Auth from './components/Auth';
import Cookies from 'universal-cookie';
import Chat from './components/Chat';
import { signOut } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase-config';
import { Grid } from '@mui/material';
import './style.scss';

const cookies = new Cookies();

const ROOM_KEY = "CHAT_ROOM_ID";
const ROOM_SESSIONS_COLLECTION = "roomSessions";

function App(props) {

const registerUserExit = async (roomId) => {
    // Controllo se l'utente è autenticato e se la stanza è definita
    if (!auth.currentUser || !roomId) return;
    
    // Il documento ID è l'UID dell'utente
    const userSessionDocRef = doc(db, ROOM_SESSIONS_COLLECTION, auth.currentUser.uid);

    try {
        await setDoc(userSessionDocRef, {
            // Salva l'orario di uscita specifico per la stanza corrente
            [roomId]: serverTimestamp(), 
            userId: auth.currentUser.uid,
        }, { merge: true }); // Usiamo merge per non cancellare i dati delle altre stanze
        console.log(`[Firestore] Registrato l'orario di uscita per la stanza ${roomId}.`);
    } catch (error) {
        console.error("Errore durante la registrazione dell'uscita:", error);
    }
  };

  //imposto come useState di default la presenza o meno del cookie in modo tale da
  // dire al browser che se manca è false
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState(localStorage.getItem(ROOM_KEY));



  //per evitare che con un banale onChange sull' <input /> ci restituisca un true (e quindi restituendoci la chat senza aver inserito il nome della chatroom
  //dobbiamo settare un useRef per prendere esattamente l'elemento che ci serve "modificare"
  const roomInputRef = useRef(null);

  const handleEnterRoom = (roomName) => {
    if (roomName && roomName.trim() !== "") {
      setRoom(roomName);
      localStorage.setItem(ROOM_KEY, roomName); // <-- SALVA LA STANZA
    }
  };

  //imposto la funzione di logout
  const signUserOut = async () => {
    if (room) {
        await registerUserExit(room);
    }
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);
    localStorage.removeItem(ROOM_KEY);
  }

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} />
      </div>
    )
  }
  return (
    <>
      {room ? (
        <Chat room={room} userId={auth.currentUser?.uid}/>
      ) : (
        <Grid className='enter-room'>
          <form onSubmit={(e) => { // Impedisce il refresh della pagina al click del bottone
              e.preventDefault(); 
              handleEnterRoom(roomInputRef.current.value);
            }}>
            <label>
              Hi! Enter your own room name and chat with friends:
            </label>
            <input
              ref={roomInputRef} />
            {/* imposto il ritorno della chatroom col value corrente dell'elemento selezionato con useRef SOLO dopo che clicco sul bottone*/}
            <button
              onClick={() => setRoom(roomInputRef.current.value)}
              type='submit'>
              Enjoy!
            </button>
          </form>
        </Grid >
      )
      }
      <Grid className='sign-out'
      >
        <button
          style={{
          }}
          onClick={signUserOut}>
          Sign Out
        </button>
      </Grid>
    </>)
}

export default App;
