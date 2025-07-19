// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBdQzUQKT2zk_D6rNoj3el3OKkDwqa-Va4",
  authDomain: "shop-pulse-a3196.firebaseapp.com",
  projectId: "shop-pulse-a3196",
  storageBucket: "shop-pulse-a3196.firebasestorage.app",
  messagingSenderId: "657260011627",
  appId: "1:657260011627:web:60557f377785fba139d12e",
  measurementId: "G-WBLP8M1FRW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };