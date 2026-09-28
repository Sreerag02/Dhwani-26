import { getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBmo6BUbFj0f3ep4IJKNN6xkGaz_kP8Wes",
  authDomain: "dhwani-cambus-ambassidor.firebaseapp.com",
  projectId: "dhwani-cambus-ambassidor",
  storageBucket: "dhwani-cambus-ambassidor.firebasestorage.app",
  messagingSenderId: "762957998637",
  appId: "1:762957998637:web:6d425ae35cf390828426a4",
};

const app = getApps().find(app => app.name === "campus-ambassador")
  ?? initializeApp(firebaseConfig, "campus-ambassador");

export const db = getFirestore(app);
