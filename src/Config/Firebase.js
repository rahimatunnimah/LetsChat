import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDfDR_ZCnvjjs74NBUPSVDVwHYNbEhuIKU',
  authDomain: 'project-chat-ba66f.firebaseapp.com',
  databaseURL: 'https://project-chat-ba66f.firebaseio.com',
  projectId: 'project-chat-ba66f',
  storageBucket: 'project-chat-ba66f.appspot.com',
  messagingSenderId: '172652762419',
  appId: '1:172652762419:web:7c9f7eaf8f8176d8c5da46',
  measurementId: 'G-DMZ533DT6H',
};
firebase.initializeApp(firebaseConfig);

export default firebase;
