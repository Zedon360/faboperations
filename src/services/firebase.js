import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // This adds the Database tool

const firebaseConfig = {
  apiKey: "AIzaSyA9paTHWS-839sCRw6AcFJUzleHCP8ZH5E",
  authDomain: "fab-operations-prod-40cd3.firebaseapp.com",
  projectId: "fab-operations-prod-40cd3",
  storageBucket: "fab-operations-prod-40cd3.firebasestorage.app",
  messagingSenderId: "125219522298",
  appId: "1:125219522298:web:3a3fd181fba6cb093deb43"
};

const app = initializeApp(firebaseConfig);

// This is the "Key" we will use to talk to your database
export const db = getFirestore(app);