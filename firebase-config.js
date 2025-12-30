// firebase-config.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

// Configuration Firebase - À remplacer avec VOS clés
const firebaseConfig = {
  apiKey: "AIzaSyDv1N6K0T9G5z8X7Y2V3W4U5X6Y7Z8A9B0C",
  authDomain: "rosas-reveillon-2025.firebaseapp.com",
  projectId: "rosas-reveillon-2025",
  storageBucket: "rosas-reveillon-2025.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890",
  measurementId: "G-ABCDEF12345"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Exporter les services
export {
  auth,
  db,
  storage,
  googleProvider,
  // Authentication methods
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  // Firestore methods
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  // Storage methods
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
};

// Initialisation automatique pour l'authentification anonyme
export const initFirebase = async () => {
  try {
    // Vérifier si déjà connecté
    const user = auth.currentUser;
    if (!user) {
      // Connexion anonyme pour les fonctionnalités basiques
      await signInAnonymously(auth);
      console.log('🔥 Firebase connecté anonymement');
    }
    return auth.currentUser;
  } catch (error) {
    console.error('Erreur Firebase:', error);
    return null;
  }
};