// js/modules/firebase-service.js
import { 
  auth, db, storage, 
  collection, doc, setDoc, getDoc, updateDoc, onSnapshot,
  addDoc, query, where, orderBy, limit, serverTimestamp,
  ref, uploadBytes, getDownloadURL, signInAnonymously
} from '../firebase-config.js';

class FirebaseService {
  constructor() {
    this.currentUser = null;
    this.unsubscribeFunctions = [];
  }

  // Initialisation
  async init() {
    try {
      // Attendre la connexion anonyme
      await signInAnonymously(auth);
      
      // Écouter les changements d'authentification
      auth.onAuthStateChanged((user) => {
        this.currentUser = user;
        if (user) {
          console.log('🔥 Utilisateur Firebase:', user.uid);
        }
      });
      
      return true;
    } catch (error) {
      console.error('Erreur init Firebase:', error);
      return false;
    }
  }

  // Gestion des parties
  async createParty(partyData) {
    try {
      const partyRef = doc(collection(db, 'parties'));
      const partyWithMetadata = {
        ...partyData,
        id: partyRef.id,
        createdAt: serverTimestamp(),
        createdBy: this.currentUser?.uid || 'anonymous',
        status: 'waiting',
        players: partyData.players || [],
        sipsHistory: []
      };
      
      await setDoc(partyRef, partyWithMetadata);
      return { success: true, partyId: partyRef.id, ...partyWithMetadata };
    } catch (error) {
      console.error('Erreur création partie:', error);
      return { success: false, error };
    }
  }

  async joinParty(partyId, playerData) {
    try {
      const partyRef = doc(db, 'parties', partyId);
      const partySnap = await getDoc(partyRef);
      
      if (!partySnap.exists()) {
        return { success: false, error: 'Partie non trouvée' };
      }
      
      const party = partySnap.data();
      const playerId = `player_${Date.now()}`;
      const newPlayer = {
        id: playerId,
        uid: this.currentUser?.uid || playerId,
        ...playerData,
        joinedAt: serverTimestamp(),
        sips: 0
      };
      
      // Ajouter le joueur à la partie
      await updateDoc(partyRef, {
        players: [...party.players, newPlayer],
        updatedAt: serverTimestamp()
      });
      
      return { success: true, playerId, party };
    } catch (error) {
      console.error('Erreur rejoindre partie:', error);
      return { success: false, error };
    }
  }

  // Écouter les changements d'une partie
  subscribeToParty(partyId, callback) {
    const partyRef = doc(db, 'parties', partyId);
    
    const unsubscribe = onSnapshot(partyRef, (snapshot) => {
      if (snapshot.exists()) {
        const partyData = snapshot.data();
        callback(partyData);
      } else {
        callback(null);
      }
    });
    
    this.unsubscribeFunctions.push(unsubscribe);
    return unsubscribe;
  }

  // Mettre à jour les sips d'un joueur
  async updatePlayerSips(partyId, playerId, sips) {
    try {
      const partyRef = doc(db, 'parties', partyId);
      const partySnap = await getDoc(partyRef);
      
      if (!partySnap.exists()) {
        return { success: false, error: 'Partie non trouvée' };
      }
      
      const party = partySnap.data();
      const updatedPlayers = party.players.map(player => 
        player.id === playerId 
          ? { ...player, sips: (player.sips || 0) + sips }
          : player
      );
      
      // Ajouter à l'historique des sips
      const sipEvent = {
        playerId,
        sips,
        timestamp: serverTimestamp(),
        reason: 'card_draw'
      };
      
      await updateDoc(partyRef, {
        players: updatedPlayers,
        sipsHistory: [...(party.sipsHistory || []), sipEvent],
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour sips:', error);
      return { success: false, error };
    }
  }

  // Gestion des photos
  async uploadPhoto(partyId, photoFile, metadata) {
    try {
      const timestamp = Date.now();
      const fileName = `photos/${partyId}/${timestamp}_${photoFile.name}`;
      const storageRef = ref(storage, fileName);
      
      // Upload du fichier
      await uploadBytes(storageRef, photoFile);
      
      // Récupérer l'URL de téléchargement
      const downloadURL = await getDownloadURL(storageRef);
      
      // Sauvegarder les métadonnées dans Firestore
      const photoDocRef = await addDoc(collection(db, 'photos'), {
        ...metadata,
        partyId,
        storagePath: fileName,
        downloadURL,
        uploadedBy: this.currentUser?.uid || 'anonymous',
        uploadedAt: serverTimestamp(),
        likes: 0,
        shares: 0
      });
      
      return { 
        success: true, 
        photoId: photoDocRef.id, 
        downloadURL,
        fileName 
      };
    } catch (error) {
      console.error('Erreur upload photo:', error);
      return { success: false, error };
    }
  }

  // Récupérer les photos d'une partie
  async getPartyPhotos(partyId, limitCount = 20) {
    try {
      const photosQuery = query(
        collection(db, 'photos'),
        where('partyId', '==', partyId),
        orderBy('uploadedAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(photosQuery);
      const photos = [];
      
      querySnapshot.forEach((doc) => {
        photos.push({ id: doc.id, ...doc.data() });
      });
      
      return { success: true, photos };
    } catch (error) {
      console.error('Erreur récupération photos:', error);
      return { success: false, error };
    }
  }

  // Nettoyage
  cleanup() {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }
}

// Singleton instance
const firebaseService = new FirebaseService();

// Export
if (typeof window !== 'undefined') {
  window.RosasFirebase = firebaseService;
}

export default firebaseService;