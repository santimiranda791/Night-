// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1W_mFLIimAvTD42T9mdH_gxcVzmhotg4",
  authDomain: "night-4a3be.firebaseapp.com",
  projectId: "night-4a3be",
  storageBucket: "night-4a3be.firebasestorage.app",
  messagingSenderId: "791355887152",
  appId: "1:791355887152:web:361ca97eed16194ac7a7f5",
  measurementId: "G-RR6QKCVL3G"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);
 export const googleProvider = new GoogleAuthProvider()
