import React, { useRef, useState } from 'react';
import Auth from './components/Auth';
import Cookies from 'universal-cookie';
import Chat from './components/Chat';
import { signOut } from 'firebase/auth';
import { auth } from './firebase-config';
import { Grid } from '@mui/material';

const cookies = new Cookies();




function App() {

  //imposto come useState di default la presenza o meno del cookie in modo tale da
  // dire al browser che se manca è false
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState(null);



  //per evitare che con un banale onChange sull' <input /> ci restituisca un true (e quindi restituendoci la chat senza aver inserito il nome della chatroom
  //dobbiamo settare un useRef per prendere esattamente l'elemento che ci serve "modificare"
  const roomInputRef = useRef(null);

  //imposto la funzione di logout
  const signUserOut = async () => {
    await signOut(auth);
    cookies.remove("auth-token");
    setIsAuth(false);
    setRoom(null);

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
        <Chat room={room} />
      ) : (
        <Grid>
          <form
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "35vh",
            fontFamily:"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
          >
            <label
              style={{
                textAlign: "center",
                fontSize: "25px",
                marginBottom: "20px"
              }}
            >Enter Room Name: </label>
            <input
              style={{
                width: "200px",
                height: "40px",
                border: "2px solid #4c983b",
                borderRadius: "6px",
                paddingLeft: "5px",
                fontSize: "20px",
                textAlign: "center",
                margin: "5px"
              }}
              ref={roomInputRef} />
            {/* imposto il ritorno della chatroom col value corrente dell'elemento selezionato con useRef SOLO dopo che clicco sul bottone*/}
            <button
              style={{
                width: "210px",
                height: "40px",
                border: "none",
                borderRadius: "6px",
                paddingLeft: "5px",
                fontSize: "20px",
                texAlign: "center",
                margin: "5px",
                backgroundColor: "#4c983b",
                color: "white",
                cursor: "pointer"
              }}
              onClick={() => setRoom(roomInputRef.current.value)}
              type='submit'>
              Enter Chat!
            </button>
          </form>
          <Grid
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <button
              style={{
                cursor: "pointer",
                fontSize: "20px",
                background: "transparent",
                color: "#ffffff",
                borderRadius: "6px",
                border: "2px solid #4c983b",
                padding: "10px",
                width: "fit-content"
              }}
              onClick={signUserOut}>
              Sign Out
            </button>
          </Grid>
        </Grid >
      )
      }
    </>)
}

export default App;
