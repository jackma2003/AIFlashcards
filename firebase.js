// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC1pPFzP_1vqzwQVFCEbPNjF2rANtAQjg",
  authDomain: "flashcardsaas-2527a.firebaseapp.com",
  projectId: "flashcardsaas-2527a",
  storageBucket: "flashcardsaas-2527a.appspot.com",
  messagingSenderId: "873163409360",
  appId: "1:873163409360:web:2e6bd9aa87d556cccb9bd5",
  measurementId: "G-WDHYY4QE63"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}