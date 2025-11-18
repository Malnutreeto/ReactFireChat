import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import Chat from './components/Chat';
import { db } from './firebase-config';
// We need deleteDoc to free the nickname
import { doc, deleteDoc } from 'firebase/firestore'; 
import { Grid } from '@mui/material';
import './style.scss';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  
  // We store the current user info here
  const [userData, setUserData] = useState(null);
  // This tries to delete the nickname if the user closes the browser.
useEffect(() => {
  const handleBeforeUnload = async () => {
    if (isAuth && userData) {
      const userId = `${userData.room}_${userData.nick}`;
      try {
        await deleteDoc(doc(db, "active_users", userId));
      } catch (e) {
        console.error("Error removing user:", e);
      }
    }
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, [isAuth, userData]);


  const signUserOut = async () => {
    if (!userData) return;

    // 1. Free the Nickname in the Database
    const userId = `${userData.room}_${userData.nick}`;
    try {
        await deleteDoc(doc(db, "active_users", userId));
    } catch (e) {
        console.error("Error removing user:", e);
    }

    // 2. Reset Local State
    setIsAuth(false);
    setUserData(null);
  };

  if (!isAuth) {
    return (
      <div>
        <Auth setIsAuth={setIsAuth} setUserData={setUserData} />
      </div>
    )
  }

  return (
    <>
      <Chat room={userData.room} userNick={userData.nick} />

      <Grid className='sign-out'>
        <button onClick={signUserOut}>
          Leave Room
        </button>
      </Grid>
    </>
  );
}

export default App;