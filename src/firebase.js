// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getDatabase } from "firebase/database";



// const firebaseConfig = {
//   apiKey: "AIzaSyD47ulJNEaox8wQijLnJOZbA7qOZEtryIQ",
//   authDomain: "realestate-9c188.firebaseapp.com",
//   projectId: "realestate-9c188",
//   storageBucket: "realestate-9c188.firebasestorage.app",
//   messagingSenderId: "171366055979",
//   appId: "1:171366055979:web:087bf0abefd3ab2672ea6e",
//   measurementId: "G-4CPBPXJ3RM"
// };


// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// export default database;

// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";   // Realtime Database
import { getAuth } from "firebase/auth";           // Authentication
import { getFirestore } from "firebase/firestore"; // Firestore (optional if you need properties)
import { getStorage } from "firebase/storage";     // Storage for images


// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD47ulJNEaox8wQijLnJOZbA7qOZEtryIQ",
  authDomain: "realestate-9c188.firebaseapp.com",
  projectId: "realestate-9c188",
  storageBucket: "realestate-9c188.firebasestorage.app",
  messagingSenderId: "171366055979",
  appId: "1:171366055979:web:087bf0abefd3ab2672ea6e",
  measurementId: "G-4CPBPXJ3RM"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Services
export const database = getDatabase(app);   // Realtime Database
export const auth = getAuth(app);           // Authentication
export const db = getFirestore(app);        // Firestore
export const storage = getStorage(app);     // Storage for images

// If you want default export, export the app
export default app;
