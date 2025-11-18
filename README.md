# Real-Time Chat Application (React & Firebase Firestore)

## 🌐 Live Demo
**[View Live Application](https://ematrito.github.io/ReactFireChat/)**

## 📝 Project Description

This is a simple, real-time web chat application built using **React** for the user interface and **Firebase Firestore** for message persistence and synchronization. Users can create or join chat rooms simply by entering a room name. All users who enter the same room name will share the same conversation in real-time.

The application leverages global variables provided by the execution environment to handle Firebase initialization and anonymous user authentication automatically.

## ✨ Key Features

* **Real-Time Messaging:** All messages are synchronized instantly among users via Firestore listeners (`onSnapshot`).
* **Dynamic Room Joining:** Join any chat room simply by typing a name. If the room does not exist, it will be created.
* **User Identification:** Uses a unique user ID (provided by the authentication system) to distinguish message authors.
* **Responsive Design:** Clean and adaptable user interface for use on both desktop and mobile devices.

## ⚙️ Execution Environment & Deployment

This application is designed for deployment to platforms like GitHub Pages *from this environment* without requiring manual configuration of API keys or environment variables.

### Automatic Configuration

The app uses three mandatory global variables that are injected automatically by the Canvas platform:

| Variable | Purpose |
| :--- | :--- |
| `__app_id` | The unique application ID, used to scope the data path in Firestore. |
| `__firebase_config` | The JSON configuration for initializing the Firebase SDK. |
| `__initial_auth_token` | The authentication token used to sign in the user for immediate access. |

**No setup is required.** The application initializes Firebase and authenticates the user upon loading.

### Firestore Database Structure

Chat data is stored in the **public collection** to allow all authenticated users to read and write messages to the same room.

**Collection Path:**
