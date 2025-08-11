// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace the below with your Firebase project's config object
const firebaseConfig = {
    apiKey: "AIzaSyAPkgFluiBWLqgwD6QVTBj8ejIeLK5tXUg",
    authDomain: "dave-db-project.firebaseapp.com",
    projectId: "dave-db-project",
    storageBucket: "dave-db-project.firebasestorage.app",
    messagingSenderId: "946574886475",
    appId: "1:946574886475:web:c576e16a3d53fbe9366fce",
    measurementId: "G-0PF1LCPZNP"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
