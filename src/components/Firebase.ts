import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyBkk0LEERGStm-QOdlDnO3IsMKvN6Ub3n8",
    authDomain: "client-6bc79.firebaseapp.com",
    databaseURL: "https://client-6bc79-default-rtdb.firebaseio.com",
    projectId: "client-6bc79",
    storageBucket: "client-6bc79.appspot.com",
    messagingSenderId: "814256773172",
    appId: "1:814256773172:web:8eef7107c9672b8cfa9261",
    measurementId: "G-N95YNZZ3P8"
  };
  
const app = initializeApp(firebaseConfig);

// Get a reference to Firestore and Firebase Storage
const storage = getStorage(app);
const db = getFirestore(app);

export { storage, db };
