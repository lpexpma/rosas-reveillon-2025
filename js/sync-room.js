// js/sync-room.js
// Synchronisation en temps réel des salles de jeu Rosas

// -------------------------
// CLASSE PRINCIPALE SYNC ROOM
// -------------------------
class SyncRoom {
  constructor(gameState, storage, uiManager) {
    this.gameState = gameState;
    this.storage = storage;
    this.uiManager = uiManager;
    
    // État de la connexion
    this.roomCode = null;
    this.userId = null;
    this.isHost = false;
    this.isConnected = false;
    this.connectionStatus = 'disconnected';
    
    // Données de la salle
    this.roomData = null;
    this.players = [];
    
    // Références Firebase
    this.firebaseUnsubscribe = null;
    this.presenceRef = null;
    this.connectedRef = null;
    
    // Timers et heartbeats
    this.heartbeatInterval = null;
    this.reconnectTimeout = null;
    this.connectionTimeout = null;
    
    // Config
    this.config = {
      maxReconnectAttempts: 5,
      reconnectDelay: 3000,
      heartbeatInterval: 10000,
      connectionTimeout: 30000
    };
    
    // Événements
    this.listeners = new Map();
    
    console.log("🔄 SyncRoom initialisé");
  }
  
  // -------------------------
  // ÉVÉNEMENTS
  // -------------------------
  
  // Ajouter un écouteur d'événement
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }
  
  // Supprimer un écouteur
  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  // Émettre un événement
  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Erreur callback ${event}:`, error);
        }
      });
    }
  }
  
  // -------------------------
  // GESTION DE LA CONNEXION
  // -------------------------
  
  // Vérifier si Firebase est disponible
  isFirebaseAvailable() {
    return typeof window !== 'undefined' && 
           window.firebase && 
           window.firebaseApp && 
           window.FirebaseUtils;
  }
  
  // Générer un ID utilisateur unique
  generateUserId() {
    // Essayer de récupérer un ID existant
    const savedId = localStorage.getItem('rosas_user_id');
    if (savedId) return savedId;
    
    // Générer un nouvel ID
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9);
    const userId = `user_${timestamp}_${random}`;
    
    // Sauvegarder
    localStorage.setItem('rosas_user_id', userId);
    
    return userId;
  }
  
  // Générer un code de salle
  generateRoomCode(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
  
  // -------------------------
  // CRÉATION DE SALLE
  // -------------------------
  
  // Créer une nouvelle salle
  async createRoom(roomName, settings = {}) {
    try {
      // Générer le code et l'ID utilisateur
      this.roomCode = this.generateRoomCode();
      this.userId = this.generateUserId();
      this.isHost = true;
      
      // Préparer les données de la salle
      const roomData = {
        code: this.roomCode,
        name: roomName || `Rosas Room ${this.roomCode}`,
        host: {
          id: this.userId,
          name: this.gameState.currentUserPseudo || 'Hôte',
          joinedAt: Date.now()
        },
        players: [{
          id: this.userId,
          name: this.gameState.currentUserPseudo || 'Hôte',
          sips: 0,
          isHost: true,
          isConnected: true,
          joinedAt: Date.now(),
          lastSeen: Date.now()
        }],
        status: 'waiting',
        settings: {
          maxPlayers: settings.maxPlayers || 8,
          private: settings.private || false,
          password: settings.password || null,
          gameDuration: settings.gameDuration || 120, // minutes
          ...settings
        },
        gameState: {
          status: 'waiting',
          currentPlayerIndex: 0,
          selectedTheme: 'HUMOUR',
          activeRule: '',
          totalTurns: 0
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
        version: '1.0'
      };
      
      // Sauvegarder localement
      this.roomData = roomData;
      this.players = roomData.players;
      
      // Si Firebase est disponible, créer la salle en ligne
      if (this.isFirebaseAvailable()) {
        await this.createFirebaseRoom(roomData);
      } else {
        // Mode local
        this.setupLocalRoom(roomData);
      }
      
      // Mettre à jour le gameState
      this.gameState.partyCode = this.roomCode;
      this.gameState.isOnline = this.isFirebaseAvailable();
      this.gameState.isHost = true;
      
      // Ajouter le joueur hôte au gameState
      const hostPlayer = {
        id: this.userId,
        name: this.gameState.currentUserPseudo || 'Hôte',
        sips: 0,
        isHost: true,
        joinedAt: Date.now()
      };
      
      this.gameState.addPlayer(hostPlayer);
      
      // Émettre l'événement
      this.emit('roomCreated', {
        roomCode: this.roomCode,
        roomData: roomData,
        isOnline: this.isFirebaseAvailable()
      });
      
      console.log(`🎮 Salle créée: ${this.roomCode}`);
      return {
        success: true,
        roomCode: this.roomCode,
        roomData: roomData
      };
      
    } catch (error) {
      console.error('❌ Erreur création salle:', error);
      this.emit('error', { type: 'createRoom', error });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Créer la salle dans Firebase
  async createFirebaseRoom(roomData) {
    try {
      const firebaseUtils = window.FirebaseUtils;
      
      // Créer la salle dans Firestore
      await firebaseUtils.createOnlineParty(
        this.roomCode,
        roomData.host.name,
        roomData.settings
      );
      
      // Mettre à jour avec les données complètes
      const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
      await roomRef.update({
        ...roomData,
        updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
      });
      
      // Configurer la présence
      await this.setupPresence();
      
      // Écouter les mises à jour
      this.setupFirebaseListeners();
      
      this.isConnected = true;
      this.connectionStatus = 'connected';
      
      console.log(`🔥 Salle créée sur Firebase: ${this.roomCode}`);
      
    } catch (error) {
      console.error('❌ Erreur création Firebase:', error);
      throw error;
    }
  }
  
  // Configurer une salle locale
  setupLocalRoom(roomData) {
    this.isConnected = true;
    this.connectionStatus = 'local';
    
    // Simuler un heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.updatePlayerPresence();
    }, this.config.heartbeatInterval);
    
    console.log(`🏠 Salle locale créée: ${this.roomCode}`);
  }
  
  // -------------------------
  // REJOINDRE UNE SALLE
  // -------------------------
  
  // Rejoindre une salle existante
  async joinRoom(roomCode, playerName) {
    try {
      // Validation
      if (!roomCode || roomCode.length < 4) {
        throw new Error('Code de salle invalide');
      }
      
      if (!playerName || playerName.length < 2) {
        throw new Error('Nom de joueur invalide');
      }
      
      this.roomCode = roomCode.toUpperCase();
      this.userId = this.generateUserId();
      this.isHost = false;
      
      // Si Firebase est disponible, rejoindre en ligne
      if (this.isFirebaseAvailable()) {
        return await this.joinFirebaseRoom(playerName);
      } else {
        // Mode local
        return this.joinLocalRoom(playerName);
      }
      
    } catch (error) {
      console.error('❌ Erreur rejoindre salle:', error);
      this.emit('error', { type: 'joinRoom', error });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Rejoindre une salle Firebase
  async joinFirebaseRoom(playerName) {
    try {
      const firebaseUtils = window.FirebaseUtils;
      
      // Vérifier si la salle existe
      const roomExists = await firebaseUtils.checkPartyExists(this.roomCode);
      if (!roomExists) {
        throw new Error('Salle introuvable');
      }
      
      // Rejoindre la salle
      const result = await firebaseUtils.joinOnlineParty(
        this.roomCode,
        playerName
      );
      
      // Récupérer les données de la salle
      this.roomData = result.party;
      this.players = this.roomData.players || [];
      
      // Configurer la présence
      await this.setupPresence();
      
      // Écouter les mises à jour
      this.setupFirebaseListeners();
      
      // Mettre à jour le gameState
      this.gameState.partyCode = this.roomCode;
      this.gameState.isOnline = true;
      this.gameState.isHost = false;
      
      // Ajouter le joueur au gameState
      const player = {
        id: this.userId,
        name: playerName,
        sips: 0,
        isHost: false,
        joinedAt: Date.now()
      };
      
      this.gameState.addPlayer(player);
      
      this.isConnected = true;
      this.connectionStatus = 'connected';
      
      // Émettre l'événement
      this.emit('roomJoined', {
        roomCode: this.roomCode,
        player: player,
        roomData: this.roomData
      });
      
      console.log(`👤 ${playerName} a rejoint la salle ${this.roomCode}`);
      
      return {
        success: true,
        roomCode: this.roomCode,
        player: player,
        roomData: this.roomData
      };
      
    } catch (error) {
      console.error('❌ Erreur rejoindre Firebase:', error);
      throw error;
    }
  }
  
  // Rejoindre une salle locale
  joinLocalRoom(playerName) {
    // Pour le mode local, on simule une salle
    this.roomData = {
      code: this.roomCode,
      name: `Salle ${this.roomCode}`,
      status: 'waiting',
      players: [{
        id: this.userId,
        name: playerName,
        sips: 0,
        isHost: false,
        isConnected: true,
        joinedAt: Date.now()
      }],
      settings: {
        maxPlayers: 8,
        private: false
      }
    };
    
    this.players = this.roomData.players;
    
    // Simuler un heartbeat
    this.heartbeatInterval = setInterval(() => {
      this.updatePlayerPresence();
    }, this.config.heartbeatInterval);
    
    // Mettre à jour le gameState
    this.gameState.partyCode = this.roomCode;
    this.gameState.isOnline = false;
    this.gameState.isHost = false;
    
    // Ajouter le joueur
    const player = {
      id: this.userId,
      name: playerName,
      sips: 0,
      isHost: false,
      joinedAt: Date.now()
    };
    
    this.gameState.addPlayer(player);
    
    this.isConnected = true;
    this.connectionStatus = 'local';
    
    // Émettre l'événement
    this.emit('roomJoined', {
      roomCode: this.roomCode,
      player: player,
      roomData: this.roomData,
      isLocal: true
    });
    
    console.log(`🏠 ${playerName} a rejoint la salle locale ${this.roomCode}`);
    
    return {
      success: true,
      roomCode: this.roomCode,
      player: player,
      roomData: this.roomData,
      isLocal: true
    };
  }
  
  // -------------------------
  // QUITTER UNE SALLE
  // -------------------------
  
  // Quitter la salle
  async leaveRoom() {
    try {
      if (!this.roomCode || !this.userId) {
        return { success: true };
      }
      
      // Si Firebase est disponible, quitter en ligne
      if (this.isFirebaseAvailable() && this.connectionStatus === 'connected') {
        await this.leaveFirebaseRoom();
      }
      
      // Nettoyer les ressources locales
      this.cleanupLocalResources();
      
      // Réinitialiser l'état
      const oldRoomCode = this.roomCode;
      
      this.roomCode = null;
      this.userId = null;
      this.isHost = false;
      this.isConnected = false;
      this.connectionStatus = 'disconnected';
      this.roomData = null;
      this.players = [];
      
      // Émettre l'événement
      this.emit('roomLeft', { roomCode: oldRoomCode });
      
      console.log(`🚪 Utilisateur a quitté la salle ${oldRoomCode}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur quitter salle:', error);
      this.emit('error', { type: 'leaveRoom', error });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Quitter une salle Firebase
  async leaveFirebaseRoom() {
    try {
      const firebaseUtils = window.FirebaseUtils;
      
      // Retirer le joueur de la salle
      await firebaseUtils.leaveOnlineParty(this.roomCode, this.userId);
      
      // Nettoyer la présence
      if (this.presenceRef) {
        await this.presenceRef.remove();
      }
      
      // Se désabonner des écouteurs
      if (this.firebaseUnsubscribe) {
        this.firebaseUnsubscribe();
        this.firebaseUnsubscribe = null;
      }
      
      // Arrêter les timers
      this.stopHeartbeat();
      this.clearReconnectTimeout();
      
    } catch (error) {
      console.error('❌ Erreur quitter Firebase:', error);
      throw error;
    }
  }
  
  // Nettoyer les ressources locales
  cleanupLocalResources() {
    // Arrêter le heartbeat
    this.stopHeartbeat();
    
    // Nettoyer les timeouts
    this.clearReconnectTimeout();
    this.clearConnectionTimeout();
    
    // Réinitialiser les références
    this.presenceRef = null;
    this.connectedRef = null;
  }
  
  // -------------------------
  // PRÉSENCE ET CONNEXION
  // -------------------------
  
  // Configurer la présence
  async setupPresence() {
    if (!this.isFirebaseAvailable() || !this.roomCode || !this.userId) {
      return;
    }
    
    try {
      // Référence de présence
      this.presenceRef = window.firebaseDb
        .collection('party_presence')
        .doc(this.roomCode)
        .collection('players')
        .doc(this.userId);
      
      // Mettre à jour la présence
      await this.presenceRef.set({
        userId: this.userId,
        playerName: this.gameState.currentUserPseudo || 'Joueur',
        isOnline: true,
        lastSeen: window.firebase.firestore.FieldValue.serverTimestamp(),
        joinedAt: Date.now()
      });
      
      // Configurer onDisconnect
      this.presenceRef.onDisconnect().delete();
      
      // Démarrer le heartbeat
      this.startHeartbeat();
      
      console.log(`📡 Présence configurée pour ${this.userId}`);
      
    } catch (error) {
      console.error('❌ Erreur configuration présence:', error);
    }
  }
  
  // Démarrer le heartbeat
  startHeartbeat() {
    this.stopHeartbeat();
    
    this.heartbeatInterval = setInterval(() => {
      this.updatePlayerPresence();
    }, this.config.heartbeatInterval);
  }
  
  // Arrêter le heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
  
  // Mettre à jour la présence du joueur
  async updatePlayerPresence() {
    if (!this.roomCode || !this.userId) return;
    
    // Mode Firebase
    if (this.isFirebaseAvailable() && this.presenceRef) {
      try {
        await this.presenceRef.update({
          lastSeen: window.firebase.firestore.FieldValue.serverTimestamp(),
          isOnline: true
        });
      } catch (error) {
        console.error('❌ Erreur mise à jour présence:', error);
      }
    }
    
    // Mode local - mettre à jour le timestamp
    if (this.roomData && this.roomData.players) {
      const playerIndex = this.roomData.players.findIndex(p => p.id === this.userId);
      if (playerIndex > -1) {
        this.roomData.players[playerIndex].lastSeen = Date.now();
      }
    }
  }
  
  // Configurer la reconnexion automatique
  setupReconnection() {
    this.clearReconnectTimeout();
    
    this.reconnectTimeout = setTimeout(() => {
      this.reconnect();
    }, this.config.reconnectDelay);
  }
  
  // Réessayer de se connecter
  async reconnect() {
    if (this.connectionStatus === 'connected' || !this.roomCode) {
      return;
    }
    
    try {
      this.connectionStatus = 'reconnecting';
      this.emit('reconnecting', { roomCode: this.roomCode });
      
      console.log(`🔄 Tentative de reconnexion à ${this.roomCode}...`);
      
      // Si Firebase était disponible, réessayer
      if (this.isFirebaseAvailable()) {
        // Essayer de rejoindre à nouveau
        await this.joinFirebaseRoom(this.gameState.currentUserPseudo || 'Joueur');
      } else {
        // Mode local - simuler la reconnexion
        this.connectionStatus = 'local';
        this.isConnected = true;
        this.emit('reconnected', { 
          roomCode: this.roomCode,
          isLocal: true 
        });
      }
      
    } catch (error) {
      console.error('❌ Échec reconnexion:', error);
      
      // Réessayer
      this.setupReconnection();
    }
  }
  
  // Nettoyer le timeout de reconnexion
  clearReconnectTimeout() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
  
  // Nettoyer le timeout de connexion
  clearConnectionTimeout() {
    if (this.connectionTimeout) {
      clearTimeout(this.connectionTimeout);
      this.connectionTimeout = null;
    }
  }
  
  // -------------------------
  // ÉCOUTEURS FIREBASE
  // -------------------------
  
  // Configurer les écouteurs Firebase
  setupFirebaseListeners() {
    if (!this.isFirebaseAvailable() || !this.roomCode) {
      return;
    }
    
    try {
      const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
      
      // Écouter les mises à jour de la salle
      this.firebaseUnsubscribe = roomRef.onSnapshot(
        (snapshot) => this.onRoomUpdate(snapshot),
        (error) => this.onFirebaseError(error)
      );
      
      console.log(`👂 Écouteurs Firebase configurés pour ${this.roomCode}`);
      
    } catch (error) {
      console.error('❌ Erreur configuration écouteurs:', error);
    }
  }
  
  // Gérer les mises à jour de la salle
  onRoomUpdate(snapshot) {
    if (!snapshot.exists) {
      // La salle a été supprimée
      this.emit('roomClosed', { roomCode: this.roomCode });
      this.leaveRoom();
      return;
    }
    
    const roomData = snapshot.data();
    this.roomData = roomData;
    this.players = roomData.players || [];
    
    // Mettre à jour le gameState si nécessaire
    if (roomData.gameState) {
      this.syncGameState(roomData.gameState);
    }
    
    // Détecter les changements de joueurs
    this.detectPlayerChanges(roomData.players);
    
    // Émettre la mise à jour
    this.emit('roomUpdated', {
      roomCode: this.roomCode,
      roomData: roomData,
      players: this.players
    });
    
    // Mettre à jour l'UI
    if (this.uiManager) {
      this.uiManager.renderPlayers();
    }
  }
  
  // Synchroniser l'état du jeu
  syncGameState(firebaseGameState) {
    if (!this.gameState || this.isHost) {
      // L'hôte est responsable des mises à jour
      return;
    }
    
    // Mettre à jour les propriétés importantes
    const updates = {
      status: firebaseGameState.status,
      currentPlayerIndex: firebaseGameState.currentPlayerIndex || 0,
      selectedTheme: firebaseGameState.selectedTheme || 'HUMOUR',
      activeRule: firebaseGameState.activeRule || '',
      totalTurns: firebaseGameState.totalTurns || 0
    };
    
    // Appliquer les mises à jour
    Object.keys(updates).forEach(key => {
      if (this.gameState[key] !== updates[key]) {
        this.gameState[key] = updates[key];
      }
    });
    
    console.log('🔄 GameState synchronisé depuis Firebase');
  }
  
  // Détecter les changements de joueurs
  detectPlayerChanges(updatedPlayers) {
    if (!this.players) return;
    
    const oldPlayers = [...this.players];
    this.players = updatedPlayers || [];
    
    // Trouver les nouveaux joueurs
    const newPlayers = this.players.filter(newPlayer => 
      !oldPlayers.some(oldPlayer => oldPlayer.id === newPlayer.id)
    );
    
    // Trouver les joueurs partis
    const leftPlayers = oldPlayers.filter(oldPlayer => 
      !this.players.some(newPlayer => newPlayer.id === oldPlayer.id)
    );
    
    // Émettre les événements
    newPlayers.forEach(player => {
      this.emit('playerJoined', {
        player: player,
        roomCode: this.roomCode
      });
    });
    
    leftPlayers.forEach(player => {
      this.emit('playerLeft', {
        playerId: player.id,
        playerName: player.name,
        roomCode: this.roomCode
      });
    });
  }
  
  // Gérer les erreurs Firebase
  onFirebaseError(error) {
    console.error('🔥 Erreur Firebase:', error);
    
    // Changer l'état de connexion
    this.isConnected = false;
    this.connectionStatus = 'error';
    
    // Émettre l'erreur
    this.emit('connectionError', {
      error: error,
      roomCode: this.roomCode
    });
    
    // Essayer de se reconnecter
    this.setupReconnection();
  }
  
  // -------------------------
  // MISE À JOUR DE LA SALLE
  // -------------------------
  
  // Mettre à jour l'état du jeu dans la salle
  async updateGameState(gameStateData) {
    if (!this.roomCode || !this.isHost) {
      return { success: false, error: 'Non autorisé' };
    }
    
    try {
      // Mode Firebase
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        
        await roomRef.update({
          gameState: gameStateData,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('🎮 GameState mis à jour sur Firebase');
        
      } else {
        // Mode local - mettre à jour en mémoire
        if (this.roomData) {
          this.roomData.gameState = gameStateData;
          this.roomData.updatedAt = Date.now();
        }
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur mise à jour GameState:', error);
      this.emit('error', { type: 'updateGameState', error });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Mettre à jour les informations d'un joueur
  async updatePlayer(playerId, playerData) {
    if (!this.roomCode) {
      return { success: false, error: 'Pas de salle' };
    }
    
    try {
      // Mode Firebase
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        
        // Récupérer les joueurs actuels
        const snapshot = await roomRef.get();
        const currentData = snapshot.data();
        const players = currentData.players || [];
        
        // Mettre à jour le joueur spécifique
        const updatedPlayers = players.map(player => {
          if (player.id === playerId) {
            return { ...player, ...playerData };
          }
          return player;
        });
        
        await roomRef.update({
          players: updatedPlayers,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
      } else {
        // Mode local
        if (this.roomData && this.roomData.players) {
          this.roomData.players = this.roomData.players.map(player => {
            if (player.id === playerId) {
              return { ...player, ...playerData };
            }
            return player;
          });
        }
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur mise à jour joueur:', error);
      this.emit('error', { type: 'updatePlayer', error });
      
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Mettre à jour ses propres informations
  async updateSelf(playerData) {
    if (!this.userId) {
      return { success: false, error: 'Utilisateur non identifié' };
    }
    
    return this.updatePlayer(this.userId, playerData);
  }
  
  // Mettre à jour les sips d'un joueur
  async updatePlayerSips(playerId, sipsChange) {
    if (!this.roomCode) return;
    
    try {
      // Récupérer les joueurs actuels
      let players = [];
      
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        const snapshot = await roomRef.get();
        const roomData = snapshot.data();
        players = roomData.players || [];
      } else {
        players = this.roomData?.players || [];
      }
      
      // Mettre à jour les sips du joueur
      const updatedPlayers = players.map(player => {
        if (player.id === playerId) {
          const currentSips = player.sips || 0;
          const newSips = Math.max(0, currentSips + sipsChange);
          
          return {
            ...player,
            sips: newSips,
            updatedAt: Date.now()
          };
        }
        return player;
      });
      
      // Sauvegarder
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        await roomRef.update({
          players: updatedPlayers,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
      } else {
        if (this.roomData) {
          this.roomData.players = updatedPlayers;
        }
      }
      
      console.log(`🥤 Sips mis à jour pour ${playerId}: ${sipsChange}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur mise à jour sips:', error);
      return { success: false, error: error.message };
    }
  }
  
  // -------------------------
  // UTILITAIRES
  // -------------------------
  
  // Obtenir l'état de la connexion
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      status: this.connectionStatus,
      roomCode: this.roomCode,
      isHost: this.isHost,
      userId: this.userId,
      playerCount: this.players?.length || 0,
      isOnline: this.isFirebaseAvailable()
    };
  }
  
  // Obtenir les informations de la salle
  getRoomInfo() {
    if (!this.roomData) return null;
    
    return {
      code: this.roomData.code,
      name: this.roomData.name,
      host: this.roomData.host,
      playerCount: this.players?.length || 0,
      maxPlayers: this.roomData.settings?.maxPlayers || 8,
      status: this.roomData.status,
      createdAt: this.roomData.createdAt,
      isPrivate: this.roomData.settings?.private || false
    };
  }
  
  // Obtenir la liste des joueurs
  getPlayers() {
    return this.players || [];
  }
  
  // Vérifier si la salle est pleine
  isRoomFull() {
    if (!this.roomData || !this.roomData.settings) return false;
    
    const maxPlayers = this.roomData.settings.maxPlayers || 8;
    const currentPlayers = this.players?.length || 0;
    
    return currentPlayers >= maxPlayers;
  }
  
  // Vérifier si un joueur est connecté
  isPlayerConnected(playerId) {
    const player = this.players.find(p => p.id === playerId);
    return player?.isConnected || false;
  }
  
  // -------------------------
  // DÉMARRAGE/ARRÊT DU JEU
  // -------------------------
  
  // Démarrer le jeu dans la salle
  async startGame() {
    if (!this.roomCode || !this.isHost) {
      return { success: false, error: 'Non autorisé' };
    }
    
    try {
      const gameStateData = {
        status: 'playing',
        startedAt: Date.now(),
        currentPlayerIndex: 0,
        totalTurns: 0
      };
      
      // Mettre à jour la salle
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        
        await roomRef.update({
          status: 'playing',
          gameState: gameStateData,
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
      } else {
        if (this.roomData) {
          this.roomData.status = 'playing';
          this.roomData.gameState = gameStateData;
          this.roomData.updatedAt = Date.now();
        }
      }
      
      // Émettre l'événement
      this.emit('gameStarted', {
        roomCode: this.roomCode,
        gameState: gameStateData
      });
      
      console.log(`🎲 Jeu démarré dans la salle ${this.roomCode}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur démarrage jeu:', error);
      return { success: false, error: error.message };
    }
  }
  
  // Terminer le jeu dans la salle
  async endGame() {
    if (!this.roomCode || !this.isHost) {
      return { success: false, error: 'Non autorisé' };
    }
    
    try {
      // Mettre à jour la salle
      if (this.isFirebaseAvailable()) {
        const roomRef = window.firebaseDb.collection('parties').doc(this.roomCode);
        
        await roomRef.update({
          status: 'finished',
          updatedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        });
        
      } else {
        if (this.roomData) {
          this.roomData.status = 'finished';
          this.roomData.updatedAt = Date.now();
        }
      }
      
      // Émettre l'événement
      this.emit('gameEnded', { roomCode: this.roomCode });
      
      console.log(`🏁 Jeu terminé dans la salle ${this.roomCode}`);
      
      return { success: true };
      
    } catch (error) {
      console.error('❌ Erreur fin jeu:', error);
      return { success: false, error: error.message };
    }
  }
  
  // -------------------------
  // DESTRUCTEUR
  // -------------------------
  
  // Nettoyer avant destruction
  destroy() {
    this.leaveRoom();
    
    // Nettoyer les écouteurs
    this.listeners.clear();
    
    console.log('♻️ SyncRoom nettoyé');
  }
}

// -------------------------
// INSTANCE GLOBALE
// -------------------------

// Créer une instance globale
window.RosasSyncRoom = new SyncRoom(
  window.RosasGameState || new GameState(),
  window.RosasStorage || new StorageLocal(),
  window.RosasUI || new UIManager()
);

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔄 SyncRoom prêt');
  });
} else {
  console.log('🔄 SyncRoom prêt');
}

// Exporter pour le débogage
if (typeof window !== 'undefined') {
  window.debugSyncRoom = {
    getStatus: () => window.RosasSyncRoom.getConnectionStatus(),
    getRoomInfo: () => window.RosasSyncRoom.getRoomInfo(),
    getPlayers: () => window.RosasSyncRoom.getPlayers(),
    isFirebaseAvailable: () => window.RosasSyncRoom.isFirebaseAvailable()
  };
}

console.log('✅ sync-room.js chargé avec succès');