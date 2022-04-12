import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: process.env.React_APP_FIREBASE_API_KEY,
  authDomain: process.env.React_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.React_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.React_APP_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.React_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.React_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// check if firebase is initialized
if (firebase.apps.length === 0) {
  console.log("Firebase is not initialized");
} else {
  console.log("Firebase is initialized");
}

export const database = firebase.database();

export default firebase;
