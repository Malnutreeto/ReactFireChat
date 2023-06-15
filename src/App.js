import React, { useRef, useState } from 'react';
import Auth from './components/Auth';
import Cookies from 'universal-cookie';
const cookies = new Cookies();



function App() {
  //imposto come useState di default la presenza o meno del cookie in modo tale da
  // dire al browser che se manca è false
  const [isAuth, setIsAuth] = useState(cookies.get('auth-token'));
  const [room, setRoom] = useState(null);

  //per evitare che con un banale onChange sull' <input /> ci restituisca un true (e quindi restituendoci la chat senza aver inserito il nome della chatroom
  //dobbiamo settare un useRef per prendere esattamente l'elemento che ci serve "modificare"
  const roomInputRef = useRef(null);

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth}/>
      </div>
    )
  }
  return (<div>
    {room ?
      (<div>
        Chat
      </div>
      ) : (
        <div className='room'>
          <label>Enter Room Name: </label>
          <input ref={roomInputRef}/>

{/* imposto il ritorno della chatroom col value corrente dell'elemento selezionato con useRef SOLO dopo che clicco sul bottone*/} 
          <button onClick={() => setRoom(roomInputRef.current.value)}>Enter Chat!</button>
        </div>
      )
    }
  </div>)
}

export default App;
