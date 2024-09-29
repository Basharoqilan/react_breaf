import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDjinZw8F4QK6dajA-7VQOsp7aqPgxNPCA",
  authDomain: "reactbreif.firebaseapp.com",
  projectId: "reactbreif",
  storageBucket: "reactbreif.appspot.com",
  messagingSenderId: "377045064095",
  appId: "1:377045064095:web:d4142d47f1f5173631c5aa",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
