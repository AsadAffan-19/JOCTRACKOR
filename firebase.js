// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDerWqKP9O6nOT1eGpoFidLOr2E_erwJdE",
  authDomain: "jobtracker-41e9b.firebaseapp.com",
  projectId: "jobtracker-41e9b",
  storageBucket: "jobtracker-41e9b.firebasestorage.app",
  messagingSenderId: "580141870610",
  appId: "1:580141870610:web:adc8078a05e26362f6b2cb",
  measurementId: "G-DY5XJCES85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);