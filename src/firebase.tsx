// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getDatabase, ref } from "firebase/database"
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChiViuf4wnZODw7VE3m0NoLC_UNpyrY-M",
  authDomain: "ionic-posts-app.firebaseapp.com",
  databaseURL:
    "https://ionic-posts-app-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ionic-posts-app",
  storageBucket: "ionic-posts-app.appspot.com",
  messagingSenderId: "674311867463",
  appId: "1:674311867463:web:e779148e93c3f0b9e27562",
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

export const db = getDatabase(app)

// Reference to the storage service
export const storage = getStorage(app)
