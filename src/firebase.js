// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyDbEJtX71NhQygVAZiyEMu0n2nRRJULg2A",
  authDomain: "budget-app-chatgpt.firebaseapp.com",
  projectId: "budget-app-chatgpt",
  storageBucket: "budget-app-chatgpt.firebasestorage.app",
  messagingSenderId: "1023261070090",
  appId: "1:1023261070090:web:7345dc0bc9212613f120f3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
