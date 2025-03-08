import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDhJYlxd7iZ6ZnjIVavlZDxZMHaZvTwpkQ",
    authDomain: "ecommerce-8f86c.firebaseapp.com",
    databaseURL: "https://ecommerce-8f86c-default-rtdb.firebaseio.com",
    projectId: "ecommerce-8f86c",
    storageBucket: "ecommerce-8f86c.firebasestorage.app",
    messagingSenderId: "201941850154",
    appId: "1:201941850154:web:2c7b52f9969670c4254b53",
    measurementId: "G-X6NER2K4L6"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getDatabase(app);

export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);