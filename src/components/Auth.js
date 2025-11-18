import React from "react";
import { useState } from "react";
import { db } from "../firebase-config";
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import "../style.scss";

export const Auth = ({ setIsAuth, setUserData }) => {
    const [tempNick, setTempNick] = useState("");
    const [tempRoom, setTempRoom] = useState("");
    const [error, setError] = useState(null);


    const handleEnterChat = async (e) => {
        e.preventDefault();
        if (!tempNick.trim() || !tempRoom.trim()) {
            setError("Please fill in both fields");
            return;
        }

        console.log("Starting authentication...");

        const cleanNick = tempNick.trim();
        const cleanRoom = tempRoom.trim().toUpperCase();
        const userId = `${cleanRoom}_${cleanNick}`;


        try {
            // 1. CHECK IF NICKNAME EXISTS
            console.log("checking if user exists...");
            const userRef = doc(db, "active_users", userId);
            const docSnap = await getDoc(userRef);

            if (docSnap.exists()) {
                // Nickname is taken in this room
                setError(`Nickname "${cleanNick}" is already taken in room ${cleanRoom}.`);
                return;
            }

            console.log("Registering user...");

            await setDoc(userRef, {
                nick: cleanNick,
                room: cleanRoom,
                enteredAt: serverTimestamp()
            });

            console.log("User registered successfully!");

            // 3. SUCCESS: Update App state
            setUserData({ nick: cleanNick, room: cleanRoom });
            setIsAuth(true); // Logged in effectively
            setError(null);

        } catch (err) {
            console.error("Error joining:", err);
            setError("Connection error. Please try again.");
        }
        
    }
    return (
        <div className="enter-room">
            <form onSubmit={handleEnterChat}>
                <label>Join a Chat Room</label>

                <input
                    placeholder="Room Name"
                    onChange={(e) => setTempRoom(e.target.value)}
                    style={{ marginBottom: '10px' }}
                />

                <input
                    placeholder="Choose a Nickname"
                    onChange={(e) => setTempNick(e.target.value)}
                />

                <button type="submit">Enter Chat</button>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
            </form>
        </div>
    );
};

export default Auth;