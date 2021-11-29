import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC0jxD8QKQWep4eX66-1yeJUNHl3J2dDz0",
  authDomain: "music-2215b.firebaseapp.com",
  projectId: "music-2215b",
  storageBucket: "music-2215b.appspot.com",
  appId: "1:906099799652:web:012d91d22b12a5527cd171",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

const userCollection = db.collection("users");
const songsCollection = db.collection("songs");

export { auth, userCollection, storage, songsCollection };
