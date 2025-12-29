// js/game-state.js
// Gestion de l'état du jeu Rosas - Compatible avec app.js et cards.js

// -------------------------
// IMPORT DES DONNÉES
// -------------------------
// Ces constantes sont définies dans cards.js
const GAME_CONSTANTS = {
  // Utilise les mêmes thèmes que cards.js
  THEME_TYPES: {
    HUMOUR: 'HUMOUR',
    SEXY: 'SEXY', 
    ACTION: 'ACTION',
    POLL: 'POLL',
    DINGUE: 'DINGUE',
    DICE: 'DICE',
    PHOTO: 'PHOTO',
    NEVER: 'NEVER',
    RULE: 'RULE'
  },
  
  // Durées en secondes
  TIMERS: {
    TURN_DURATION: 30,
    PHOTO_TIMEOUT: 30
  },
  
  // Configurations du jeu
  SETTINGS: {
    MAX_PLAYERS: 8,
    MIN_PLAYERS: 2,
    INITIAL_SIPS: 0
  },
  
  // État du jeu
  GAME_STATUS: {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED: 'finished'
  }
};

// -------------------------
// CLASSE GAME STATE
// -------------------------
class GameState {
  constructor() {
    // Configuration de base
    this.partyCode = "ROSAS";
    this.partyLink = "";
    this.isOnline = false;
    this.isHost = false;
    this.currentUserPseudo = "";
    this.userGender = "unknown";
    
    // État du jeu (compatible avec app.js)
    this.players = [];
    this.playerOrder = [];
    this.currentPlayerIndex = 0;
    this.selectedTheme = "HUMOUR";
    this.activeRule = "";
    this.photos = [];
    this.currentPhotoMission = "";
    
    // Cartes
    this.currentCard = null;
    this.availableCards = {};
    this.usedCards = {};
    this.cardsDatabase = window.CARDS_DATABASE || {};
    
    // Timers et scores
    this.timer = null;
    this.timeLeft = 0;
    this.totalTurns = 0;
    this.startTime = null;
    this.endTime = null;
    
    // Callbacks
    this.onStateChange = null;
    this.onPlayersUpdate = null;
    this.onCardUpdate = null;
    
    console.log("🎮 GameState créé");
  }
  
  // -------------------------
  // INITIALISATION
  // -------------------------
  
  // Initialiser avec l'état existant de app.js
  initializeFromAppState(appState) {
    if (!appState) return;
    
    this.partyCode = appState.partyCode || "ROSAS";
    this.partyLink = appState.partyLink || "";
    this.players = [...(appState.players || [])];
    this.selectedTheme = appState.selectedTheme || "HUMOUR";
    this.activeRule = appState.activeRule || "";
    this.photos = [...(appState.photos || [])];
    this.currentPhotoMission = appState.currentPhotoMission || "";
    
    // Mettre à jour l'ordre des joueurs
    this.updatePlayerOrder();
    
    console.log("🔄 GameState initialisé depuis app.js");
  }
  
  // Mettre à jour l'ordre des joueurs
  updatePlayerOrder() {
    // Tri par joinedAt
    this.playerOrder = [...this.players]
      .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0))
      .map(p => p.id);
    
    console.log("👥 Ordre des joueurs mis à jour:", this.playerOrder);
  }
  
  // -------------------------
  // GESTION DES JOUEURS
  // -------------------------
  
  // Ajouter un joueur
  addPlayer(playerData) {
    // Vérifier si le joueur existe déjà
    const existingPlayer = this.players.find(p => 
      p.id === playerData.id || 
      p.name.toLowerCase() === playerData.name.toLowerCase()
    );
    
    if (existingPlayer) {
      console.log(`⚠️ Joueur déjà présent: ${playerData.name}`);
      return existingPlayer;
    }
    
    // Vérifier la limite de joueurs
    if (this.players.length >= GAME_CONSTANTS.SETTINGS.MAX_PLAYERS) {
      console.log(`❌ Limite de ${GAME_CONSTANTS.SETTINGS.MAX_PLAYERS} joueurs atteinte`);
      return null;
    }
    
    // Créer le joueur
    const newPlayer = {
      id: playerData.id || `p${Date.now()}`,
      name: playerData.name,
      sips: playerData.sips || GAME_CONSTANTS.SETTINGS.INITIAL_SIPS,
      gender: playerData.gender || "unknown",
      joinedAt: playerData.joinedAt || Date.now(),
      isHost: playerData.isHost || false,
      turnsPlayed: 0,
      cardsDrawn: 0
    };
    
    this.players.push(newPlayer);
    this.updatePlayerOrder();
    
    console.log(`👤 Joueur ajouté: ${newPlayer.name}`);
    
    // Mettre à jour l'interface
    if (this.onPlayersUpdate) {
      this.onPlayersUpdate([...this.players]);
    }
    this.triggerStateChange();
    
    return newPlayer;
  }
  
  // Retirer un joueur
  removePlayer(playerId) {
    const playerIndex = this.players.findIndex(p => p.id === playerId);
    
    if (playerIndex !== -1) {
      const player = this.players[playerIndex];
      this.players.splice(playerIndex, 1);
      
      console.log(`👋 Joueur retiré: ${player.name}`);
      
      // Mettre à jour l'ordre
      this.updatePlayerOrder();
      
      // Si plus de joueurs, terminer le jeu
      if (this.players.length < GAME_CONSTANTS.SETTINGS.MIN_PLAYERS) {
        this.endGame();
      }
      
      if (this.onPlayersUpdate) {
        this.onPlayersUpdate([...this.players]);
      }
      this.triggerStateChange();
      return true;
    }
    
    return false;
  }
  
  // Obtenir le joueur actuel
  getCurrentPlayer() {
    if (this.playerOrder.length === 0 || this.currentPlayerIndex >= this.playerOrder.length) {
      return null;
    }
    
    const currentPlayerId = this.playerOrder[this.currentPlayerIndex];
    return this.players.find(p => p.id === currentPlayerId);
  }
  
  // Passer au joueur suivant
  nextPlayer() {
    if (this.playerOrder.length === 0) return null;
    
    // Incrémenter l'index
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.playerOrder.length;
    this.totalTurns++;
    
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer) {
      currentPlayer.turnsPlayed = (currentPlayer.turnsPlayed || 0) + 1;
    }
    
    console.log(`🔄 Tour ${this.totalTurns} - Joueur: ${currentPlayer?.name}`);
    
    if (this.onPlayersUpdate) {
      this.onPlayersUpdate([...this.players]);
    }
    this.triggerStateChange();
    
    return currentPlayer;
  }
  
  // Mettre à jour les sips d'un joueur
  updatePlayerSips(playerId, sipsChange) {
    const player = this.players.find(p => p.id === playerId);
    if (!player) return false;
    
    player.sips = Math.max(0, (player.sips || 0) + sipsChange);
    console.log(`🥤 ${player.name} : ${sipsChange > 0 ? '+' : ''}${sipsChange} gorgée(s). Total: ${player.sips}`);
    
    if (this.onPlayersUpdate) {
      this.onPlayersUpdate([...this.players]);
    }
    this.triggerStateChange();
    
    return true;
  }
  
  // -------------------------
  // GESTION DES CARTES
  // -------------------------
  
  // Initialiser les cartes (à appeler au début du jeu)
  initializeCards() {
    this.availableCards = {};
    this.usedCards = {};
    
    // Copier toutes les cartes de CARDS_DATABASE
    for (const theme in this.cardsDatabase) {
      this.availableCards[theme] = [...this.cardsDatabase[theme]];
      this.usedCards[theme] = [];
    }
    
    // Mélanger les cartes
    this.shuffleCards();
    
    console.log("🎴 Cartes initialisées");
  }
  
  // Mélanger les cartes
  shuffleCards() {
    for (const theme in this.availableCards) {
      for (let i = this.availableCards[theme].length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.availableCards[theme][i], this.availableCards[theme][j]] = 
          [this.availableCards[theme][j], this.availableCards[theme][i]];
      }
    }
    
    console.log("🔀 Cartes mélangées");
  }
  
  // Piocher une carte
  drawCard(theme = null) {
    const selectedTheme = theme || this.selectedTheme;
    
    // Vérifier si des cartes sont disponibles
    if (!this.availableCards[selectedTheme] || this.availableCards[selectedTheme].length === 0) {
      console.log(`⚠️ Plus de cartes pour ${selectedTheme}, on recharge`);
      this.replenishTheme(selectedTheme);
    }
    
    // Piocher une carte
    const card = this.availableCards[selectedTheme].pop();
    if (!card) {
      console.error(`❌ Aucune carte disponible pour ${selectedTheme}`);
      return null;
    }
    
    // Marquer comme utilisée
    this.usedCards[selectedTheme].push(card);
    this.currentCard = card;
    
    // Mettre à jour les statistiques du joueur
    const currentPlayer = this.getCurrentPlayer();
    if (currentPlayer) {
      currentPlayer.cardsDrawn = (currentPlayer.cardsDrawn || 0) + 1;
    }
    
    // Gérer les règles
    if (card.rule) {
      this.activeRule = card.rule;
      console.log(`📜 Nouvelle règle: ${card.rule}`);
    }
    
    // Gérer les missions photo
    if (card.theme === "PHOTO") {
      this.currentPhotoMission = card.text;
    }
    
    console.log(`🎴 Carte tirée: ${card.text.substring(0, 50)}...`);
    
    // Déclencher le callback
    if (this.onCardUpdate) {
      this.onCardUpdate(card);
    }
    
    this.triggerStateChange();
    return card;
  }
  
  // Recharger les cartes d'un thème
  replenishTheme(theme) {
    if (!this.usedCards[theme] || this.usedCards[theme].length === 0) {
      console.log(`⚠️ Aucune carte utilisée pour recharger ${theme}`);
      return;
    }
    
    // Remettre les cartes utilisées dans les disponibles
    this.availableCards[theme] = [...this.usedCards[theme]];
    this.usedCards[theme] = [];
    
    // Mélanger
    this.shuffleCards();
    
    console.log(`🔄 Thème ${theme} rechargé`);
  }
  
  // Obtenir les statistiques des cartes
  getCardsStats() {
    const stats = {};
    let totalCards = 0;
    let usedTotal = 0;
    let remainingTotal = 0;
    
    for (const theme in this.cardsDatabase) {
      const total = this.cardsDatabase[theme].length;
      const used = this.usedCards[theme]?.length || 0;
      const remaining = this.availableCards[theme]?.length || 0;
      
      stats[theme] = {
        total,
        used,
        remaining,
        progress: total > 0 ? Math.round((used / total) * 100) : 0
      };
      
      totalCards += total;
      usedTotal += used;
      remainingTotal += remaining;
    }
    
    return {
      totalCards,
      usedCards: usedTotal,
      remainingCards: remainingTotal,
      progress: Math.round((usedTotal / totalCards) * 100),
      byTheme: stats
    };
  }
  
  // -------------------------
  // GESTION DES PHOTOS
  // -------------------------
  
  // Ajouter une photo
  addPhoto(photoData) {
    const photo = {
      id: `photo_${Date.now()}`,
      dataUrl: photoData.dataUrl,
      playerId: this.getCurrentPlayer()?.id,
      playerName: this.getCurrentPlayer()?.name || "Inconnu",
      mission: this.currentPhotoMission || photoData.mission || "",
      timestamp: Date.now()
    };
    
    this.photos.push(photo);
    
    // Garder seulement les 30 dernières photos
    if (this.photos.length > 30) {
      this.photos = this.photos.slice(-30);
    }
    
    console.log(`📸 Photo ajoutée par ${photo.playerName}`);
    
    this.triggerStateChange();
    return photo;
  }
  
  // -------------------------
  // GESTION DU TEMPS
  // -------------------------
  
  // Démarrer un timer
  startTimer(duration) {
    this.stopTimer();
    
    this.timeLeft = duration;
    this.timer = setInterval(() => {
      this.timeLeft--;
      
      if (this.timeLeft <= 0) {
        this.stopTimer();
        console.log("⏰ Temps écoulé !");
        
        // Passer au joueur suivant
        this.nextPlayer();
      }
    }, 1000);
    
    console.log(`⏱️ Timer démarré: ${duration}s`);
  }
  
  // Arrêter le timer
  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  // -------------------------
  // GESTION DE LA PARTIE
  // -------------------------
  
  // Démarrer la partie
  startGame() {
    if (this.players.length < GAME_CONSTANTS.SETTINGS.MIN_PLAYERS) {
      console.log(`❌ Pas assez de joueurs (min ${GAME_CONSTANTS.SETTINGS.MIN_PLAYERS})`);
      return false;
    }
    
    // Initialiser les cartes si ce n'est pas déjà fait
    if (Object.keys(this.availableCards).length === 0) {
      this.initializeCards();
    }
    
    this.startTime = Date.now();
    this.currentPlayerIndex = 0;
    this.totalTurns = 0;
    
    console.log(`🎮 Partie démarrée avec ${this.players.length} joueurs`);
    
    this.triggerStateChange();
    return true;
  }
  
  // Terminer la partie
  endGame() {
    this.endTime = Date.now();
    this.stopTimer();
    
    // Calculer les scores
    this.calculateScores();
    
    console.log("🏁 Partie terminée");
    
    this.triggerStateChange();
    return true;
  }
  
  // Calculer les scores finaux
  calculateScores() {
    // Le gagnant est celui qui a le moins de sips
    this.players.sort((a, b) => (a.sips || 0) - (b.sips || 0));
    
    console.log("🏆 Scores calculés");
  }
  
  // Obtenir le classement
  getRanking() {
    return this.players
      .map((player, index) => ({
        rank: index + 1,
        name: player.name,
        sips: player.sips || 0,
        turnsPlayed: player.turnsPlayed || 0,
        cardsDrawn: player.cardsDrawn || 0
      }));
  }
  
  // -------------------------
  // UTILITAIRES
  // -------------------------
  
  // Obtenir un snapshot de l'état
  getStateSnapshot() {
    return {
      partyCode: this.partyCode,
      partyLink: this.partyLink,
      players: [...this.players],
      playerOrder: [...this.playerOrder],
      currentPlayerIndex: this.currentPlayerIndex,
      selectedTheme: this.selectedTheme,
      activeRule: this.activeRule,
      photos: [...this.photos],
      currentPhotoMission: this.currentPhotoMission,
      currentCard: this.currentCard,
      timeLeft: this.timeLeft,
      totalTurns: this.totalTurns,
      startTime: this.startTime,
      endTime: this.endTime,
      isHost: this.isHost,
      isOnline: this.isOnline,
      userGender: this.userGender,
      stats: this.getCardsStats()
    };
  }
  
  // Déclencher les callbacks
  triggerStateChange() {
    if (this.onStateChange) {
      this.onStateChange(this.getStateSnapshot());
    }
  }
  
  // Exporter l'état (pour sauvegarde)
  exportState() {
    return JSON.stringify(this.getStateSnapshot());
  }
  
  // Importer l'état
  importState(stateJson) {
    try {
      const state = JSON.parse(stateJson);
      
      // Mettre à jour les propriétés
      Object.keys(state).forEach(key => {
        if (key in this && key !== 'onStateChange' && key !== 'onPlayersUpdate' && key !== 'onCardUpdate') {
          this[key] = state[key];
        }
      });
      
      console.log("🔄 État importé");
      this.triggerStateChange();
      
    } catch (error) {
      console.error("❌ Erreur import état:", error);
    }
  }
}

// -------------------------
// INSTANCE GLOBALE
// -------------------------

// Créer une instance globale
window.RosasGameState = new GameState();

// Initialiser avec les données existantes
function initializeGameState() {
  // Attendre que l'application soit chargée
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Si app.js a un état global, l'utiliser
      if (window.RosasApp && window.RosasApp.state) {
        window.RosasGameState.initializeFromAppState(window.RosasApp.state);
      }
      
      console.log("✅ GameState initialisé");
    });
  } else {
    if (window.RosasApp && window.RosasApp.state) {
      window.RosasGameState.initializeFromAppState(window.RosasApp.state);
    }
    console.log("✅ GameState initialisé");
  }
}

// Démarrer l'initialisation
initializeGameState();

console.log("🎮 game-state.js chargé avec succès");