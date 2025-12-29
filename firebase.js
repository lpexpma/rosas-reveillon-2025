// Configuration Firebase (remplacez par vos clés)
const firebaseConfig = {
  apiKey: "AIzaSyBv4Z7XgD1oE9vTqL8hW7nJkLmNpQrStUv",
  authDomain: "rosas-reveillon-2025.firebaseapp.com",
  databaseURL: "https://rosas-reveillon-2025-default-rtdb.firebaseio.com",
  projectId: "rosas-reveillon-2025",
  storageBucket: "rosas-reveillon-2025.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialisation Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();