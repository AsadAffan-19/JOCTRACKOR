import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDerWqKP9O6nOT1eGpoFidLOr2E_erwJdE",
  authDomain: "jobtracker-41e9b.firebaseapp.com",
  projectId: "jobtracker-41e9b",
  storageBucket: "jobtracker-41e9b.firebasestorage.app",
  messagingSenderId: "580141870610",
  appId: "1:580141870610:web:adc8078a05e26362f6b2cb",
  measurementId: "G-DY5XJCES85"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
