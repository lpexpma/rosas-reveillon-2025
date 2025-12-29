// js/firebase-init.js
// Initialisation de Firebase pour Rosas

// -------------------------
// CONFIGURATION FIREBASE (VOS CLÉS)
// -------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAhxGM1EjgHy7-ebSkjknW_FUcKSh5h_lk",
  authDomain: "rosas-reveillon-2025.firebaseapp.com",
  databaseURL: "https://rosas-reveillon-2025-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "rosas-reveillon-2025",
  storageBucket: "rosas-reveillon-2025.firebasestorage.app",
  messagingSenderId: "648254611178",
  appId: "1:648254611178:web:4f002c8fa9cfc2ffc40193"
};

// -------------------------
// INITIALISATION FIREBASE
// -------------------------

// Vérifier si Firebase est déjà initialisé
let firebaseApp;
let db;
let storage;
let analytics;

try {
  // Vérifier que Firebase est chargé
  if (typeof firebase === 'undefined') {
    throw new Error("Firebase SDK non chargé");
  }
  
  // Initialiser Firebase
  firebaseApp = firebase.initializeApp(firebaseConfig);
  
  // Initialiser Firestore (base de données)
  db = firebase.firestore();
  
  // Initialiser Storage (pour les photos)
  storage = firebase.storage();
  
  // Initialiser Analytics (optionnel)
  analytics = firebase.analytics();
  
  console.log("✅ Firebase initialisé avec succès");
  
  // Configurer Firestore pour le mode démo (désactiver la persistance si hors ligne)
  if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
    db.settings({
      experimentalForceLongPolling: true // Pour les problèmes de connexion en local
    });
    console.log("🔧 Mode développement activé");
  }
  
} catch (error) {
  console.error("❌ Erreur d'initialisation Firebase:", error);
  
  // Mode démo - initialiser des objets simulés
  console.log("⚠️ Mode démo activé (Firebase non disponible)");
  initDemoMode();
}

// -------------------------
// MODE DÉMO (si Firebase n'est pas disponible)
// -------------------------
function initDemoMode() {
  // Simuler Firestore
  db = {
    collection: (name) => ({
      doc: (id) => ({
        get: () => Promise.resolve({
          exists: false,
          data: () => null
        }),
        set: (data) => {
          console.log("📝 Mode démo - set document:", name, id, data);
          return Promise.resolve();
        },
        update: (data) => {
          console.log("📝 Mode démo - update document:", name, id, data);
          return Promise.resolve();
        },
        delete: () => {
          console.log("🗑️ Mode démo - delete document:", name, id);
          return Promise.resolve();
        },
        onSnapshot: (callback) => {
          console.log("👂 Mode démo - écoute document:", name, id);
          // Simuler un callback après 1 seconde
          setTimeout(() => callback({
            exists: false,
            data: () => null
          }), 1000);
          return () => {}; // Fonction de nettoyage
        }
      }),
      add: (data) => {
        console.log("➕ Mode démo - add document:", name, data);
        return Promise.resolve({ id: 'demo_' + Date.now() });
      },
      where: () => ({
        get: () => {
          console.log("🔍 Mode démo - query documents");
          return Promise.resolve({
            empty: true,
            docs: [],
            forEach: () => {}
          });
        },
        onSnapshot: (callback) => {
          console.log("👂 Mode démo - écoute query");
          setTimeout(() => callback({
            empty: true,
            docs: [],
            forEach: () => {}
          }), 1000);
          return () => {};
        }
      })
    })
  };
  
  // Simuler Storage
  storage = {
    ref: (path) => ({
      put: (file) => {
        console.log("📸 Mode démo - upload file:", path, file.name);
        return Promise.resolve({
          ref: { 
            getDownloadURL: () => Promise.resolve(`demo://${path}/${file.name}`) 
          }
        });
      },
      getDownloadURL: () => Promise.resolve(`demo://${path}`)
    })
  };
  
  // Simuler Analytics
  analytics = {
    logEvent: (eventName, eventParams) => {
      console.log("📊 Mode démo - analytics:", eventName, eventParams);
    }
  };
}

// -------------------------
// FONCTIONS UTILITAIRES POUR LES PARTIES EN LIGNE
// -------------------------

// Créer une nouvelle partie en ligne
async function createOnlineParty(partyCode, hostName, settings = {}) {
  try {
    // Valider le code de la partie (4-8 caractères, lettres/chiffres)
    const validCode = /^[A-Z0-9]{4,8}$/.test(partyCode);
    if (!validCode) {
      throw new Error("Code invalide. Utilisez 4-8 lettres/chiffres");
    }
    
    const partyData = {
      code: partyCode.toUpperCase(),
      host: hostName,
      players: [{
        id: generateUserId(),
        name: hostName,
        sips: 0,
        joinedAt: Date.now(),
        isHost: true
      }],
      status: 'waiting',
      settings: {
        maxPlayers: 8,
        gameDuration: 60, // minutes
        private: false,
        ...settings
      },
      currentGame: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    await db.collection('parties').doc(partyCode).set(partyData);
    
    console.log(`🎮 Partie en ligne créée: ${partyCode}`);
    
    // Enregistrer dans Analytics
    if (analytics && analytics.logEvent) {
      analytics.logEvent('party_created', {
        party_code: partyCode,
        host_name: hostName
      });
    }
    
    return partyData;
    
  } catch (error) {
    console.error("Erreur création partie:", error);
    
    // Si c'est une erreur de permission, c'est peut-être le mode démo
    if (error.code === 'permission-denied') {
      console.log("⚠️ Mode démo - création simulée");
      // Simuler une création réussie en mode démo
      return {
        code: partyCode.toUpperCase(),
        host: hostName,
        players: [{
          id: generateUserId(),
          name: hostName,
          sips: 0,
          joinedAt: Date.now(),
          isHost: true
        }],
        status: 'waiting',
        settings: { maxPlayers: 8, gameDuration: 60, private: false, ...settings }
      };
    }
    
    throw error;
  }
}

// Rejoindre une partie en ligne
async function joinOnlineParty(partyCode, playerName) {
  try {
    const partyRef = db.collection('parties').doc(partyCode);
    const partyDoc = await partyRef.get();
    
    if (!partyDoc.exists) {
      throw new Error("Partie non trouvée. Vérifiez le code.");
    }
    
    const partyData = partyDoc.data();
    
    // Vérifier si la partie est en cours
    if (partyData.status === 'playing') {
      throw new Error("La partie est déjà en cours");
    }
    
    // Vérifier si la partie est terminée
    if (partyData.status === 'finished') {
      throw new Error("La partie est terminée");
    }
    
    // Vérifier si le salon est plein
    if (partyData.players.length >= partyData.settings.maxPlayers) {
      throw new Error("Salon complet (max " + partyData.settings.maxPlayers + " joueurs)");
    }
    
    // Vérifier si le pseudo est déjà pris
    if (partyData.players.some(p => p.name.toLowerCase() === playerName.toLowerCase())) {
      throw new Error("Pseudo déjà pris");
    }
    
    // Vérifier la longueur du pseudo
    if (playerName.length < 2 || playerName.length > 20) {
      throw new Error("Pseudo trop court ou trop long (2-20 caractères)");
    }
    
    const newPlayer = {
      id: generateUserId(),
      name: playerName,
      sips: 0,
      joinedAt: Date.now(),
      isHost: false
    };
    
    // Ajouter le joueur à la partie
    await partyRef.update({
      players: firebase.firestore.FieldValue.arrayUnion(newPlayer),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`👤 ${playerName} a rejoint la partie ${partyCode}`);
    
    // Analytics
    if (analytics && analytics.logEvent) {
      analytics.logEvent('player_joined', {
        party_code: partyCode,
        player_name: playerName
      });
    }
    
    return {
      player: newPlayer,
      party: partyData
    };
    
  } catch (error) {
    console.error("Erreur rejoindre partie:", error);
    throw error;
  }
}

// Quitter une partie
async function leaveOnlineParty(partyCode, playerId) {
  try {
    const partyRef = db.collection('parties').doc(partyCode);
    const partyDoc = await partyRef.get();
    
    if (!partyDoc.exists) {
      return; // Partie déjà supprimée
    }
    
    const partyData = partyDoc.data();
    
    // Trouver le joueur à retirer
    const playerToRemove = partyData.players.find(p => p.id === playerId);
    if (!playerToRemove) {
      return; // Joueur déjà parti
    }
    
    // Retirer le joueur
    const updatedPlayers = partyData.players.filter(p => p.id !== playerId);
    
    // Si plus de joueurs, supprimer la partie
    if (updatedPlayers.length === 0) {
      await partyRef.delete();
      console.log(`🗑️ Partie ${partyCode} supprimée (plus de joueurs)`);
    } else {
      // Si l'hôte part, désigner un nouvel hôte
      if (playerToRemove.isHost && updatedPlayers.length > 0) {
        updatedPlayers[0].isHost = true;
      }
      
      await partyRef.update({
        players: updatedPlayers,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`👋 Joueur ${playerToRemove.name} a quitté la partie ${partyCode}`);
    }
    
  } catch (error) {
    console.error("Erreur quitter partie:", error);
  }
}

// Démarrer une partie
async function startOnlineParty(partyCode) {
  try {
    await db.collection('parties').doc(partyCode).update({
      status: 'playing',
      startedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`🎲 Partie ${partyCode} démarrée`);
    
    if (analytics && analytics.logEvent) {
      analytics.logEvent('game_started', { party_code: partyCode });
    }
    
  } catch (error) {
    console.error("Erreur démarrage partie:", error);
    throw error;
  }
}

// Terminer une partie
async function finishOnlineParty(partyCode) {
  try {
    await db.collection('parties').doc(partyCode).update({
      status: 'finished',
      finishedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`🏁 Partie ${partyCode} terminée`);
    
    if (analytics && analytics.logEvent) {
      analytics.logEvent('game_finished', { party_code: partyCode });
    }
    
  } catch (error) {
    console.error("Erreur fin partie:", error);
  }
}

// Mettre à jour les sips d'un joueur
async function updatePlayerSips(partyCode, playerId, sipsChange) {
  try {
    const partyRef = db.collection('parties').doc(partyCode);
    const partyDoc = await partyRef.get();
    
    if (!partyDoc.exists) {
      return;
    }
    
    const partyData = partyDoc.data();
    const updatedPlayers = partyData.players.map(player => {
      if (player.id === playerId) {
        const newSips = Math.max(0, (player.sips || 0) + sipsChange);
        return { ...player, sips: newSips };
      }
      return player;
    });
    
    await partyRef.update({
      players: updatedPlayers,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`🥤 Sips mis à jour pour joueur ${playerId}: ${sipsChange}`);
    
  } catch (error) {
    console.error("Erreur mise à jour sips:", error);
  }
}

// Écouter les changements d'une partie
function listenToParty(partyCode, callback) {
  try {
    return db.collection('parties').doc(partyCode)
      .onSnapshot((doc) => {
        if (doc.exists) {
          callback(doc.data());
        } else {
          callback(null);
        }
      }, (error) => {
        console.error("Erreur écoute partie:", error);
        callback(null);
      });
      
  } catch (error) {
    console.error("Erreur configuration écoute:", error);
    
    // Mode démo : simuler un snapshot périodique
    const demoInterval = setInterval(() => {
      callback(null);
    }, 5000);
    
    return () => clearInterval(demoInterval); // Retourne une fonction de nettoyage
  }
}

// Sauvegarder une photo dans Firebase Storage
async function savePhotoToStorage(file, partyCode, playerName) {
  try {
    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("L'image est trop volumineuse (max 5MB)");
    }
    
    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      throw new Error("Le fichier doit être une image");
    }
    
    // Générer un nom de fichier unique
    const timestamp = Date.now();
    const sanitizedName = playerName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${partyCode}_${sanitizedName}_${timestamp}.jpg`;
    
    // Créer une référence dans le stockage
    const storageRef = storage.ref(`photos/${partyCode}/${fileName}`);
    
    // Uploader le fichier avec métadonnées
    const metadata = {
      customMetadata: {
        partyCode: partyCode,
        playerName: playerName,
        uploadedAt: timestamp.toString()
      }
    };
    
    const snapshot = await storageRef.put(file, metadata);
    
    // Obtenir l'URL de téléchargement
    const downloadURL = await snapshot.ref.getDownloadURL();
    
    console.log(`📸 Photo sauvegardée: ${downloadURL}`);
    
    // Analytics
    if (analytics && analytics.logEvent) {
      analytics.logEvent('photo_uploaded', {
        party_code: partyCode,
        player_name: playerName,
        file_size: file.size
      });
    }
    
    return downloadURL;
    
  } catch (error) {
    console.error("Erreur sauvegarde photo:", error);
    throw error;
  }
}

// Sauvegarder une photo dans Firestore
async function savePhotoToFirestore(photoData, partyCode) {
  try {
    const photoRef = await db.collection('parties').doc(partyCode)
      .collection('photos')
      .add({
        ...photoData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    
    console.log(`💾 Photo enregistrée dans Firestore: ${photoRef.id}`);
    return photoRef.id;
    
  } catch (error) {
    console.error("Erreur sauvegarde Firestore:", error);
    throw error;
  }
}

// Récupérer les photos d'une partie
async function getPartyPhotos(partyCode, limit = 20) {
  try {
    const photosSnapshot = await db.collection('parties').doc(partyCode)
      .collection('photos')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    const photos = [];
    photosSnapshot.forEach(doc => {
      photos.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return photos;
    
  } catch (error) {
    console.error("Erreur récupération photos:", error);
    return [];
  }
}

// Vérifier si une partie existe
async function checkPartyExists(partyCode) {
  try {
    const partyDoc = await db.collection('parties').doc(partyCode).get();
    return partyDoc.exists;
  } catch (error) {
    console.error("Erreur vérification partie:", error);
    return false;
  }
}

// Générer un ID utilisateur unique
function generateUserId() {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substr(2, 9);
  return `user_${timestamp}_${randomStr}`;
}

// Générer un code de partie aléatoire
function generatePartyCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// -------------------------
// GESTION DES ERREURS
// -------------------------
function handleFirebaseError(error) {
  console.error("Firebase Error:", error);
  
  const errorMessages = {
    'permission-denied': "Vous n'avez pas la permission d'effectuer cette action",
    'unavailable': "Service temporairement indisponible. Mode démo activé.",
    'not-found': "Ressource non trouvée",
    'already-exists': "Cette partie existe déjà",
    'failed-precondition': "La partie n'est pas dans le bon état",
    'resource-exhausted': "Limite de requêtes atteinte. Réessayez plus tard."
  };
  
  const message = errorMessages[error.code] || error.message || "Erreur de connexion";
  
  // Afficher une notification à l'utilisateur
  if (typeof showNotification === 'function') {
    showNotification("❌", "Erreur", message, 3000);
  } else if (typeof alert === 'function') {
    alert(`Erreur: ${message}`);
  }
  
  return message;
}

// -------------------------
// EXPORTS
// -------------------------

// Exporter les objets Firebase
window.firebaseApp = firebaseApp;
window.firebaseDb = db;
window.firebaseStorage = storage;
window.firebaseAnalytics = analytics;

// Exporter les fonctions utilitaires
window.FirebaseUtils = {
  // Gestion des parties
  createOnlineParty,
  joinOnlineParty,
  leaveOnlineParty,
  startOnlineParty,
  finishOnlineParty,
  updatePlayerSips,
  listenToParty,
  checkPartyExists,
  
  // Photos
  savePhotoToStorage,
  savePhotoToFirestore,
  getPartyPhotos,
  
  // Utilitaires
  generateUserId,
  generatePartyCode,
  handleFirebaseError,
  
  // Mode démo
  isDemoMode: () => !firebaseApp || window.location.hostname === "localhost"
};

// Événement de chargement
document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Firebase initialisé pour Rosas");
  console.log("🎮 Projet: Rosas Réveillon 2025");
  console.log("🌐 Mode:", window.FirebaseUtils.isDemoMode() ? "Démo" : "Production");
  
  // Journaliser un événement Analytics
  if (analytics && analytics.logEvent) {
    analytics.logEvent('app_loaded', {
      app_name: 'Rosas Réveillon 2025',
      timestamp: Date.now(),
      demo_mode: window.FirebaseUtils.isDemoMode()
    });
  }
});

// -------------------------
// CONFIGURATION DES RÈGLES DE SÉCURITÉ (exemple)
// -------------------------
/*
Règles Firestore à mettre dans Firebase Console:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /parties/{partyId} {
      allow read: if true;
      allow write: if request.auth != null || 
                   request.resource.data.players[0].isHost == true;
      
      match /photos/{photoId} {
        allow read: if true;
        allow write: if request.auth != null;
      }
    }
  }
}

Règles Storage:

rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{partyCode}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

console.log("✅ firebase-init.js chargé avec la configuration de rosas-reveillon-2025");