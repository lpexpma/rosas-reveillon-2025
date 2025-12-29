// js/app.js
// Version 2.1 - Application Rosas Réveillon 2025 avec WhatsApp et Jauge de Sobriété

// -------------------------
// INITIALISATION
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log("🎉 Rosas Réveillon 2025 - Version 2.1");
  
  // Initialiser les modules globaux
  initializeApplication();
  
  // Configurer les événements
  setupGlobalEventListeners();
  
  // Vérifier et restaurer la dernière session
  restoreLastSession();
  
  // Démarrer les animations
  startAmbientAnimations();
});

// -------------------------
// SOBRIETY GAUGE MANAGER
// -------------------------
class SobrietyGaugeManager {
  constructor() {
    this.maxSips = 20;
    this.visibleToAll = true;
    this.levels = [
      { min: 0, max: 5, color: 'gauge-level-0', status: 'Sobre 😎', emoji: '🥂' },
      { min: 6, max: 10, color: 'gauge-level-1', status: 'Chaud 🌟', emoji: '🍷' },
      { min: 11, max: 15, color: 'gauge-level-2', status: 'Joyeu(x)se 🎉', emoji: '🍾' },
      { min: 16, max: 19, color: 'gauge-level-3', status: 'Éméché(e) 😅', emoji: '🥴' },
      { min: 20, max: 999, color: 'gauge-level-4', status: 'K.O. 💀', emoji: '☠️' }
    ];
  }

  getLevel(sips) {
    return this.levels.find(level => sips >= level.min && sips <= level.max) || this.levels[0];
  }

  updatePlayerGauge(playerId, sips) {
    const playerCard = document.querySelector(`[data-player-id="${playerId}"]`);
    if (!playerCard) return;
    
    const percentage = Math.min((sips / this.maxSips) * 100, 100);
    const level = this.getLevel(sips);
    
    let gauge = playerCard.querySelector('.sobriety-gauge');
    
    if (!gauge) {
      gauge = this.createGaugeElement();
      playerCard.querySelector('.player-info').appendChild(gauge);
    }
    
    const fill = gauge.querySelector('.gauge-fill');
    fill.style.width = `${percentage}%`;
    fill.className = `gauge-fill ${level.color}`;
    
    const info = gauge.querySelector('.gauge-info');
    if (info) {
      info.querySelector('.current-sips').textContent = `${sips} verres`;
      info.querySelector('.gauge-status').textContent = `${level.status} ${level.emoji}`;
    }
    
    this.updateVisibility();
  }

  createGaugeElement() {
    const template = `
      <div class="sobriety-gauge">
        <div class="gauge-fill gauge-level-0" style="width: 0%"></div>
      </div>
      <div class="gauge-info">
        <span class="current-sips">0 verres</span>
        <span class="gauge-status">Sobre 😎</span>
      </div>
    `;
    
    const container = document.createElement('div');
    container.className = 'sobriety-gauge-container player-gauge';
    container.innerHTML = template;
    
    return container;
  }

  toggleVisibility() {
    this.visibleToAll = !this.visibleToAll;
    
    const gameContainer = document.querySelector('.game-container');
    const toggleBtn = document.querySelector('.gauge-visibility-toggle');
    
    if (this.visibleToAll) {
      gameContainer.classList.remove('gauges-hidden');
      toggleBtn.textContent = '👁️ Masquer jauges';
    } else {
      gameContainer.classList.add('gauges-hidden');
      toggleBtn.textContent = '👁️ Afficher toutes';
    }
    
    localStorage.setItem('gaugesVisible', this.visibleToAll);
  }

  updateVisibility() {
    const gameContainer = document.querySelector('.game-container');
    if (!gameContainer) return;
    
    if (!this.visibleToAll) {
      gameContainer.classList.add('gauges-hidden');
    } else {
      gameContainer.classList.remove('gauges-hidden');
    }
  }

  init() {
    const controls = document.querySelector('.game-controls');
    if (controls && !document.querySelector('.gauge-visibility-toggle')) {
      const toggleBtn = document.createElement('button');
      toggleBtn.className = 'gauge-visibility-toggle';
      toggleBtn.textContent = this.visibleToAll ? '👁️ Masquer jauges' : '👁️ Afficher toutes';
      toggleBtn.addEventListener('click', () => this.toggleVisibility());
      controls.appendChild(toggleBtn);
    }
    
    const savedVisibility = localStorage.getItem('gaugesVisible');
    if (savedVisibility !== null) {
      this.visibleToAll = JSON.parse(savedVisibility);
      this.updateVisibility();
    }
  }
}

// -------------------------
// WHATSAPP SHARING MANAGER
// -------------------------
class WhatsAppSharingManager {
  constructor() {
    this.groupLink = "https://chat.whatsapp.com/C7NM0X8RfTN0a1wRjN22WS";
  }

  setupButton() {
    const photoActions = document.querySelector('.photo-actions');
    if (!photoActions || document.getElementById('whatsapp-share-btn')) return;
    
    const whatsappBtn = document.createElement('button');
    whatsappBtn.id = 'whatsapp-share-btn';
    whatsappBtn.className = 'btn-whatsapp';
    whatsappBtn.innerHTML = '<i class="whatsapp-icon">📱</i> Envoyer au groupe';
    whatsappBtn.addEventListener('click', () => this.shareCurrentPhoto());
    
    photoActions.appendChild(whatsappBtn);
  }

  shareCurrentPhoto() {
    const photos = window.RosasGameState?.getPhotos?.();
    const lastPhoto = photos?.[photos.length - 1];
    
    if (!lastPhoto) {
      window.RosasUI?.showNotification?.("📸", "Aucune photo", "Prenez d'abord une photo");
      return;
    }
    
    const partyCode = window.RosasGameState?.partyCode || "ROSAS2025";
    const playerName = window.RosasGameState?.getCurrentPlayer?.()?.name || "Anonyme";
    const mission = window.RosasGameState?.currentPhotoMission || "Défi Rosas";
    
    const message = encodeURIComponent(
      `📸 *Rosas 2025 - Moment d'exception*\n\n` +
      `🎯 *Mission:* ${mission}\n` +
      `👤 *Joueur:* ${playerName}\n` +
      `🎮 *Code:* ${partyCode}\n\n` +
      `Partagé via l'app Rosas 🥂\n` +
      `#Rosas2025 #MomentRare`
    );
    
    const whatsappShareLink = `https://wa.me/?text=${message}`;
    
    window.open(whatsappShareLink, '_blank');
    
    window.RosasStorage?.updateUserStat?.('photosShared', 1);
    
    window.RosasUI?.showToast?.("✅ Photo partagée au groupe WhatsApp", "success");
  }

  shareGameInvite(partyCode) {
    const message = encodeURIComponent(
      `🎉 *Rejoins ma partie Rosas 2025 !*\n\n` +
      `🎮 *Code de la partie:* ${partyCode}\n` +
      `👤 *Hôte:* ${window.RosasGameState?.currentUserPseudo || "Moi"}\n\n` +
      `Clique sur le lien pour rejoindre :\n` +
      `${window.location.origin}?party=${partyCode}\n\n` +
      `À tout de suite ! 🥂`
    );
    
    const whatsappLink = `https://wa.me/?text=${message}`;
    window.open(whatsappLink, '_blank');
  }
}

// -------------------------
// INITIALISATION DE L'APPLICATION
// -------------------------
function initializeApplication() {
  console.log("🚀 Initialisation de l'application...");
  
  // Vérifier que tous les modules sont chargés
  if (!window.RosasGameState) {
    console.error("❌ GameState non chargé");
    window.RosasGameState = new GameState();
  }
  
  if (!window.RosasStorage) {
    console.error("❌ Storage non chargé");
    window.RosasStorage = new StorageLocal();
  }
  
  if (!window.RosasSyncRoom) {
    console.error("❌ SyncRoom non chargé");
    window.RosasSyncRoom = new SyncRoom(
      window.RosasGameState,
      window.RosasStorage,
      window.RosasUI
    );
  }
  
  if (!window.RosasUI) {
    console.error("❌ UI Manager non chargé");
    window.RosasUI = new UIManager(window.RosasGameState);
  }
  
  // Initialiser les nouveaux managers
  window.RosasSobrietyGauge = new SobrietyGaugeManager();
  window.RosasWhatsApp = new WhatsAppSharingManager();
  
  // Configurer les callbacks
  setupCallbacks();
  
  // Charger les paramètres utilisateur
  loadUserSettings();
  
  // Initialiser les jauges
  window.RosasSobrietyGauge.init();
  
  console.log("✅ Application initialisée avec WhatsApp et Jauges");
}

// -------------------------
// GESTION DES PARAMÈTRES UTILISATEUR
// -------------------------
function loadUserSettings() {
  const settings = window.RosasStorage.loadUserSettings();
  
  if (settings) {
    window.RosasGameState.currentUserPseudo = settings.pseudo || "";
    window.RosasGameState.userGender = settings.gender || "unknown";
    
    if (window.RosasUI.updateWelcomeMessage) {
      window.RosasUI.updateWelcomeMessage();
    }
    
    const pseudoInput = document.getElementById('user-pseudo');
    if (pseudoInput && settings.pseudo) {
      pseudoInput.value = settings.pseudo;
    }
    
    console.log(`👤 Utilisateur chargé: ${settings.pseudo}`);
  }
}

function saveUserSettings() {
  const pseudoInput = document.getElementById('user-pseudo');
  const gender = window.RosasGameState.userGender || "unknown";
  
  if (pseudoInput && pseudoInput.value.trim()) {
    const settings = {
      pseudo: pseudoInput.value.trim(),
      gender: gender,
      soundEnabled: true,
      notifications: true,
      darkMode: false,
      vibration: true
    };
    
    window.RosasStorage.saveUserSettings(settings);
    window.RosasGameState.currentUserPseudo = settings.pseudo;
    window.RosasGameState.userGender = gender;
    
    console.log(`💾 Utilisateur sauvegardé: ${settings.pseudo}`);
  }
}

// -------------------------
// GESTION DES ÉVÉNEMENTS
// -------------------------
function setupGlobalEventListeners() {
  console.log("🎯 Configuration des événements...");
  
  document.addEventListener('click', handleGlobalClick);
  document.addEventListener('keydown', handleKeyPress);
  
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => e.preventDefault());
  });
  
  setupButtonListeners();
  setupGameListeners();
  
  console.log("✅ Événements configurés");
}

function handleGlobalClick(e) {
  const target = e.target;
  
  if (target.hasAttribute('data-nav')) {
    e.preventDefault();
    const screenId = target.getAttribute('data-nav');
    window.RosasUI.showScreen(screenId);
    return;
  }
  
  if (target.hasAttribute('data-action')) {
    e.preventDefault();
    const action = target.getAttribute('data-action');
    handleAction(action, target);
    return;
  }
  
  // WhatsApp sharing button
  if (target.closest('#whatsapp-share-btn')) {
    e.preventDefault();
    window.RosasWhatsApp.shareCurrentPhoto();
    return;
  }
  
  // WhatsApp invite button
  if (target.closest('#whatsapp-invite-btn')) {
    e.preventDefault();
    const partyCode = window.RosasGameState.partyCode;
    if (partyCode) {
      window.RosasWhatsApp.shareGameInvite(partyCode);
    }
    return;
  }
  
  if (target.closest('.button')) {
    const button = target.closest('.button');
    handleButtonClick(button);
  }
}

function handleKeyPress(e) {
  if (e.key === 'Escape') {
    window.RosasUI.showScreen('screen-home');
    return;
  }
  
  if (e.key === 'Enter') {
    const activeScreen = window.RosasUI.currentScreen;
    
    switch(activeScreen) {
      case 'screen-pseudo':
        const continueBtn = document.getElementById('btn-continue');
        if (continueBtn) continueBtn.click();
        break;
        
      case 'screen-join':
        const joinBtn = document.getElementById('btn-join');
        if (joinBtn) joinBtn.click();
        break;
        
      case 'screen-card':
        const validateBtn = document.getElementById('btn-validate');
        if (validateBtn) validateBtn.click();
        break;
    }
  }
}

// -------------------------
// GESTION DES BOUTONS
// -------------------------
function setupButtonListeners() {
  // Pseudo/Accueil
  const continueBtn = document.getElementById('btn-continue');
  if (continueBtn) continueBtn.addEventListener('click', handleContinue);
  
  // Rejoindre une partie
  const joinBtn = document.getElementById('btn-join');
  if (joinBtn) joinBtn.addEventListener('click', handleJoinParty);
  
  // Créer une partie
  const createBtn = document.getElementById('btn-create-party');
  if (createBtn) createBtn.addEventListener('click', handleCreateParty);
  
  // WhatsApp Invite
  const whatsappInviteBtn = document.getElementById('whatsapp-invite-btn');
  if (!whatsappInviteBtn && window.RosasGameState?.isHost) {
    const lobbyControls = document.querySelector('.lobby-controls');
    if (lobbyControls) {
      const btn = document.createElement('button');
      btn.id = 'whatsapp-invite-btn';
      btn.className = 'button button-whatsapp';
      btn.innerHTML = '<i class="whatsapp-icon">📱</i> Inviter via WhatsApp';
      btn.addEventListener('click', () => {
        const partyCode = window.RosasGameState.partyCode;
        if (partyCode) {
          window.RosasWhatsApp.shareGameInvite(partyCode);
        }
      });
      lobbyControls.appendChild(btn);
    }
  }
  
  // Démarrer le jeu
  const startBtn = document.getElementById('btn-start-game');
  if (startBtn) startBtn.addEventListener('click', handleStartGame);
  
  // Copier le lien
  const copyLinkBtn = document.getElementById('copy-link');
  if (copyLinkBtn) copyLinkBtn.addEventListener('click', handleCopyLink);
  
  // Tirer une carte
  const drawBtn = document.getElementById('btn-draw');
  if (drawBtn) drawBtn.addEventListener('click', handleDrawCard);
  
  // Passer son tour
  const passBtn = document.getElementById('btn-pass');
  const passBtn2 = document.getElementById('btn-pass2');
  if (passBtn) passBtn.addEventListener('click', () => handlePassTurn());
  if (passBtn2) passBtn2.addEventListener('click', () => handlePassTurn());
  
  // Valider une carte
  const validateBtn = document.getElementById('btn-validate');
  if (validateBtn) validateBtn.addEventListener('click', handleValidateCard);
  
  // Photos
  const photoSaveBtn = document.getElementById('btn-photo-save');
  const photoSkipBtn = document.getElementById('btn-photo-skip');
  if (photoSaveBtn) photoSaveBtn.addEventListener('click', handleSavePhoto);
  if (photoSkipBtn) photoSkipBtn.addEventListener('click', handleSkipPhoto);
  
  // Album
  const albumSendBtn = document.getElementById('btn-album-send');
  if (albumSendBtn) albumSendBtn.addEventListener('click', handleSendAlbum);
  
  // Dé
  const rollDiceBtn = document.getElementById('btn-roll-dice');
  if (rollDiceBtn) rollDiceBtn.addEventListener('click', handleRollDice);
  
  // Je n'ai jamais
  const yesBtn = document.getElementById('btn-yes');
  const noBtn = document.getElementById('btn-no');
  if (yesBtn) yesBtn.addEventListener('click', () => handleNeverAnswer(true));
  if (noBtn) noBtn.addEventListener('click', () => handleNeverAnswer(false));
  
  // Setup WhatsApp button for photos
  window.RosasWhatsApp.setupButton();
}

function handleButtonClick(button) {
  const buttonId = button.id;
  
  switch(buttonId) {
    case 'btn-create-online':
      handleCreateOnlineParty();
      break;
      
    case 'btn-join-online':
      handleJoinOnlineParty();
      break;
      
    case 'btn-local-game':
      handleLocalGame();
      break;
      
    case 'btn-show-stats':
      window.RosasUI.showScreen('screen-stats');
      break;
      
    case 'btn-show-album':
      window.RosasUI.showScreen('screen-album');
      break;
      
    case 'btn-show-settings':
      showSettingsModal();
      break;
      
    case 'btn-refresh-players':
      window.RosasUI.renderPlayers();
      break;
      
    case 'btn-end-game':
      handleEndGame();
      break;
  }
}

// -------------------------
// GESTION DU JEU
// -------------------------
function setupGameListeners() {
  if (window.RosasGameState && window.RosasGameState.onStateChange) {
    window.RosasGameState.onStateChange = (state) => {
      updateUIFromState(state);
    };
  }
  
  if (window.RosasGameState && window.RosasGameState.onPlayersUpdate) {
    window.RosasGameState.onPlayersUpdate = (players) => {
      window.RosasUI.renderPlayers();
      updateAllGauges();
    };
  }
  
  if (window.RosasGameState && window.RosasGameState.onCardUpdate) {
    window.RosasGameState.onCardUpdate = (card) => {
      window.RosasUI.displayCard(card);
    };
  }
  
  // Écouter les mises à jour des sips pour mettre à jour les jauges
  if (window.RosasGameState && window.RosasGameState.onSipsUpdate) {
    window.RosasGameState.onSipsUpdate = (playerId, sips) => {
      if (window.RosasSobrietyGauge) {
        window.RosasSobrietyGauge.updatePlayerGauge(playerId, sips);
      }
    };
  }
  
  if (window.RosasSyncRoom) {
    window.RosasSyncRoom.on('roomCreated', handleRoomCreated);
    window.RosasSyncRoom.on('roomJoined', handleRoomJoined);
    window.RosasSyncRoom.on('roomLeft', handleRoomLeft);
    window.RosasSyncRoom.on('playerJoined', handlePlayerJoined);
    window.RosasSyncRoom.on('playerLeft', handlePlayerLeft);
    window.RosasSyncRoom.on('gameStarted', handleGameStarted);
    window.RosasSyncRoom.on('gameEnded', handleGameEnded);
    window.RosasSyncRoom.on('error', handleSyncError);
  }
  
  const photoInput = document.getElementById('photo-input');
  if (photoInput) {
    photoInput.addEventListener('change', handlePhotoInputChange);
  }
}

function setupCallbacks() {
  window.RosasGameState.onStateChange = (state) => {
    updateUIFromState(state);
    window.RosasStorage.saveGameState(state);
  };
  
  window.RosasGameState.onPlayersUpdate = (players) => {
    window.RosasUI.renderPlayers();
    window.RosasStorage.savePlayersData(players);
    updateAllGauges();
  };
  
  window.RosasGameState.onCardUpdate = (card) => {
    window.RosasUI.displayCard(card);
    if (card) {
      window.RosasStorage.updateCardStat(card.id, card.theme, 'drawn');
    }
  };
  
  window.RosasGameState.onSipsUpdate = (playerId, sips) => {
    if (window.RosasSobrietyGauge) {
      window.RosasSobrietyGauge.updatePlayerGauge(playerId, sips);
    }
  };
}

// -------------------------
// HANDLERS PRINCIPAUX
// -------------------------
function handleContinue() {
  saveUserSettings();
  window.RosasUI.showScreen('screen-join');
}

function handleCreateParty() {
  const pseudo = window.RosasGameState.currentUserPseudo;
  if (!pseudo) {
    window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
    window.RosasUI.showScreen('screen-pseudo');
    return;
  }
  
  const partyCode = window.RosasSyncRoom.generateRoomCode(6);
  
  window.RosasGameState.partyCode = partyCode;
  window.RosasGameState.isOnline = false;
  window.RosasGameState.isHost = true;
  
  window.RosasGameState.addPlayer({
    id: 'host_' + Date.now(),
    name: pseudo,
    sips: 0,
    isHost: true,
    joinedAt: Date.now()
  });
  
  updatePartyLink(partyCode);
  
  window.RosasUI.showScreen('screen-lobby');
  window.RosasUI.showNotification("🎉", "Partie créée", `Code: ${partyCode}`);
  
  // Ajouter le bouton WhatsApp dans le lobby
  setTimeout(() => {
    const lobbyControls = document.querySelector('.lobby-controls');
    if (lobbyControls && !document.getElementById('whatsapp-invite-btn')) {
      const btn = document.createElement('button');
      btn.id = 'whatsapp-invite-btn';
      btn.className = 'button button-whatsapp';
      btn.innerHTML = '<i class="whatsapp-icon">📱</i> Inviter via WhatsApp';
      btn.addEventListener('click', () => {
        window.RosasWhatsApp.shareGameInvite(partyCode);
      });
      lobbyControls.appendChild(btn);
    }
  }, 100);
}

function handleJoinParty() {
  const pseudo = window.RosasGameState.currentUserPseudo;
  const codeInput = document.getElementById('join-code');
  
  if (!pseudo) {
    window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
    window.RosasUI.showScreen('screen-pseudo');
    return;
  }
  
  if (!codeInput || !codeInput.value.trim()) {
    window.RosasUI.showNotification("❌", "Erreur", "Entre un code de partie");
    return;
  }
  
  const partyCode = codeInput.value.trim().toUpperCase();
  
  window.RosasGameState.partyCode = partyCode;
  window.RosasGameState.isOnline = false;
  window.RosasGameState.isHost = false;
  
  window.RosasGameState.addPlayer({
    id: 'player_' + Date.now(),
    name: pseudo,
    sips: 0,
    isHost: false,
    joinedAt: Date.now()
  });
  
  window.RosasUI.showScreen('screen-lobby');
  window.RosasUI.showNotification("✅", "Partie rejointe", `Code: ${partyCode}`);
}

function handleStartGame() {
  if (window.RosasGameState.players.length < 2) {
    window.RosasUI.showNotification("⏳", "En attente", "Il faut au moins 2 joueurs");
    return;
  }
  
  window.RosasGameState.initializeCards();
  
  if (window.RosasGameState.startGame()) {
    if (window.RosasGameState.isOnline && window.RosasSyncRoom) {
      window.RosasSyncRoom.startGame();
    }
    
    window.RosasUI.showScreen('screen-game');
    window.RosasUI.showNotification("🎲", "C'est parti !", "À toi de jouer");
    
    // Initialiser les jauges
    setTimeout(() => {
      updateAllGauges();
      window.RosasSobrietyGauge.refreshGaugesVisibility();
    }, 100);
  }
}

function handleDrawCard() {
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  
  if (!currentPlayer) {
    window.RosasUI.showNotification("❌", "Erreur", "Aucun joueur actif");
    return;
  }
  
  const card = window.RosasGameState.drawCard();
  
  if (card) {
    window.RosasStorage.updateUserStat('cardsDrawn', 1);
    window.RosasStorage.updateThemeUsage(card.theme);
    
    if (card.drink > 0) {
      window.RosasGameState.updatePlayerSips(currentPlayer.id, card.drink);
      window.RosasStorage.updateUserStat('sipsTaken', card.drink);
    }
  }
}

function handlePassTurn() {
  const currentCard = window.RosasGameState.currentCard;
  
  if (!currentCard || !currentCard.canPass) {
    window.RosasUI.showNotification("❌", "Impossible", "Cette carte ne peut pas être passée");
    return;
  }
  
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  if (currentPlayer) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, 1);
    window.RosasStorage.updateUserStat('sipsTaken', 1);
  }
  
  handleNextTurn();
}

function handleValidateCard() {
  const currentCard = window.RosasGameState.currentCard;
  
  if (!currentCard) return;
  
  switch(currentCard.ui) {
    case 'poll':
      break;
    case 'designate':
      break;
    case 'never':
      break;
    case 'dice':
      break;
    case 'photo':
      break;
    default:
      handleNextTurn();
  }
}

// -------------------------
// GESTION DES PHOTOS
// -------------------------
function handlePhotoInputChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  window.RosasUI.handlePhotoSelected(file);
}

function saveCurrentPhoto() {
  const previewImg = document.getElementById('photo-preview');
  
  if (!previewImg || !previewImg.dataset.pending) {
    window.RosasUI.showNotification("❌", "Erreur", "Aucune photo sélectionnée");
    return null;
  }
  
  const photoData = {
    dataUrl: previewImg.dataset.pending,
    playerName: window.RosasGameState.getCurrentPlayer()?.name || "Anonyme",
    mission: window.RosasGameState.currentPhotoMission
  };
  
  window.RosasGameState.addPhoto(photoData);
  window.RosasStorage.updateUserStat('photosTaken', 1);
  
  return photoData;
}

function handleSavePhoto() {
  const photoData = saveCurrentPhoto();
  if (photoData) {
    handleNextTurn();
    window.RosasUI.showNotification("📸", "Photo enregistrée", "Ajoutée à l'album");
  }
}

function handleSkipPhoto() {
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  if (currentPlayer) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, 2);
    window.RosasStorage.updateUserStat('sipsTaken', 2);
  }
  
  handleNextTurn();
}

// -------------------------
// GESTION DU DÉ
// -------------------------
function handleRollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  
  window.RosasUI.showNotification("🎲", `Dé: ${result}`, "Résultat du lancer");
  applyDiceEffect(result);
  
  setTimeout(() => {
    handleNextTurn();
  }, 2000);
}

function applyDiceEffect(result) {
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  if (!currentPlayer) return;
  
  switch(result) {
    case 1:
      window.RosasGameState.updatePlayerSips(currentPlayer.id, 1);
      break;
    case 2:
      distributeSips(2, currentPlayer);
      break;
    case 3:
      window.RosasGameState.players.forEach(player => {
        window.RosasGameState.updatePlayerSips(player.id, 1);
      });
      break;
    case 4:
      window.RosasGameState.activeRule = `Immunité pour ${currentPlayer.name} ce tour`;
      break;
    case 5:
      break;
    case 6:
      window.RosasGameState.players.forEach(player => {
        if (player.id !== currentPlayer.id) {
          window.RosasGameState.updatePlayerSips(player.id, 2);
        }
      });
      break;
  }
}

// -------------------------
// GESTION "JE N'AI JAMAIS"
// -------------------------
function handleNeverAnswer(yes) {
  const currentCard = window.RosasGameState.currentCard;
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  
  if (!currentCard || !currentPlayer) return;
  
  if (yes) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, currentCard.drink || 1);
    window.RosasStorage.updateUserStat('sipsTaken', currentCard.drink || 1);
  } else {
    window.RosasGameState.players.forEach(player => {
      if (player.id !== currentPlayer.id) {
        window.RosasGameState.updatePlayerSips(player.id, 1);
      }
    });
  }
  
  handleNextTurn();
}

// -------------------------
// UTILITAIRES DE JEU
// -------------------------
function handleNextTurn() {
  const nextPlayer = window.RosasGameState.nextPlayer();
  
  if (nextPlayer) {
    window.RosasUI.updateCurrentPlayerInfo();
    window.RosasUI.renderPlayers();
    window.RosasStorage.updateUserStat('totalTurns', 1);
    
    if (window.RosasGameState.isOnline && window.RosasSyncRoom) {
      const gameStateData = {
        currentPlayerIndex: window.RosasGameState.currentPlayerIndex,
        totalTurns: window.RosasGameState.totalTurns,
        activeRule: window.RosasGameState.activeRule
      };
      window.RosasSyncRoom.updateGameState(gameStateData);
    }
    
    window.RosasUI.showScreen('screen-game');
    
    // Mettre à jour la visibilité des jauges
    if (window.RosasSobrietyGauge) {
      window.RosasSobrietyGauge.refreshGaugesVisibility();
    }
  }
}

function distributeSips(amount, fromPlayer) {
  window.RosasUI.showNotification("🥂", "Distribution", `Distribue ${amount} gorgée(s)`);
  
  const otherPlayers = window.RosasGameState.players.filter(p => p.id !== fromPlayer.id);
  if (otherPlayers.length > 0) {
    const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    window.RosasGameState.updatePlayerSips(randomPlayer.id, amount);
    window.RosasStorage.updateUserStat('sipsGiven', amount);
  }
}

function updateAllGauges() {
  if (!window.RosasSobrietyGauge) return;
  
  const playerCards = document.querySelectorAll('.player-card');
  playerCards.forEach(card => {
    const playerId = card.dataset.playerId;
    const player = window.RosasGameState.players.find(p => p.id === playerId);
    
    if (player) {
      let gauge = card.querySelector('.sobriety-gauge');
      if (!gauge) {
        gauge = window.RosasSobrietyGauge.createGaugeElement();
        const playerInfo = card.querySelector('.player-info');
        if (playerInfo) {
          playerInfo.appendChild(gauge);
        }
      }
      
      window.RosasSobrietyGauge.updatePlayerGauge(playerId, player.sips || 0);
    }
  });
}

// -------------------------
// GESTION DES PARTIES EN LIGNE
// -------------------------
function handleCreateOnlineParty() {
  const pseudo = window.RosasGameState.currentUserPseudo;
  
  if (!pseudo) {
    window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
    window.RosasUI.showScreen('screen-pseudo');
    return;
  }
  
  window.RosasSyncRoom.createRoom(`Partie de ${pseudo}`, {
    maxPlayers: 8,
    private: false
  }).then(result => {
    if (result.success) {
      window.RosasUI.showScreen('screen-lobby');
      window.RosasUI.showNotification("🌐", "Partie en ligne créée", `Code: ${result.roomCode}`);
    } else {
      window.RosasUI.showNotification("❌", "Erreur", result.error);
    }
  });
}

function handleJoinOnlineParty() {
  const pseudo = window.RosasGameState.currentUserPseudo;
  const codeInput = document.getElementById('join-code');
  
  if (!pseudo) {
    window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
    window.RosasUI.showScreen('screen-pseudo');
    return;
  }
  
  if (!codeInput || !codeInput.value.trim()) {
    window.RosasUI.showNotification("❌", "Erreur", "Entre un code de partie");
    return;
  }
  
  window.RosasSyncRoom.joinRoom(
    codeInput.value.trim().toUpperCase(),
    pseudo
  ).then(result => {
    if (result.success) {
      window.RosasUI.showScreen('screen-lobby');
      window.RosasUI.showNotification("✅", "Connecté", `Partie: ${result.roomCode}`);
    } else {
      window.RosasUI.showNotification("❌", "Erreur", result.error);
    }
  });
}

function handleLocalGame() {
  window.RosasUI.showNotification("🏠", "Mode local", "Partie hors ligne démarrée");
  window.RosasUI.showScreen('screen-pseudo');
}

// -------------------------
// HANDLERS D'ÉVÉNEMENTS SYNC ROOM
// -------------------------
function handleRoomCreated(data) {
  console.log("🎮 Salle créée:", data.roomCode);
  updatePartyLink(data.roomCode);
}

function handleRoomJoined(data) {
  console.log("👤 Rejoint la salle:", data.roomCode);
  window.RosasUI.updateLobbyInfo();
}

function handleRoomLeft(data) {
  console.log("🚪 Quitté la salle:", data.roomCode);
  window.RosasUI.showScreen('screen-join');
}

function handlePlayerJoined(data) {
  console.log("👋 Nouveau joueur:", data.player.name);
  window.RosasUI.showNotification("👤", "Nouveau joueur", `${data.player.name} a rejoint`);
  window.RosasUI.renderPlayers();
}

function handlePlayerLeft(data) {
  console.log("👋 Joueur parti:", data.playerName);
  window.RosasUI.showNotification("👋", "Départ", `${data.playerName} a quitté`);
  window.RosasUI.renderPlayers();
}

function handleGameStarted(data) {
  console.log("🎲 Jeu démarré dans la salle");
  window.RosasUI.showScreen('screen-game');
  window.RosasGameState.startGame();
}

function handleGameEnded(data) {
  console.log("🏁 Jeu terminé");
  window.RosasUI.showScreen('screen-stats');
}

function handleSyncError(data) {
  console.error("🔥 Erreur SyncRoom:", data.error);
  window.RosasUI.showNotification("⚠️", "Connexion perdue", "Mode local activé");
}

// -------------------------
// FONCTIONS UTILITAIRES
// -------------------------
function updatePartyLink(partyCode) {
  const partyLink = `${window.location.origin}?party=${partyCode}`;
  window.RosasGameState.partyLink = partyLink;
  
  const linkDisplay = document.getElementById('party-link');
  if (linkDisplay) {
    linkDisplay.textContent = partyLink;
  }
}

function handleCopyLink() {
  if (!window.RosasGameState.partyLink) return;
  
  navigator.clipboard.writeText(window.RosasGameState.partyLink)
    .then(() => {
      window.RosasUI.showNotification("📋", "Lien copié", "Partage-le avec tes amis");
    })
    .catch(err => {
      console.error('Erreur copie:', err);
    });
}

function handleSendAlbum() {
  const emailInput = document.getElementById('album-email');
  
  if (!emailInput || !emailInput.value) {
    window.RosasUI.showNotification("❌", "Erreur", "Entre ton email");
    return;
  }
  
  if (window.RosasGameState.photos.length === 0) {
    window.RosasUI.showNotification("📸", "Album vide", "Prends des photos d'abord");
    return;
  }
  
  window.RosasUI.showNotification("📧", "Album envoyé", `À ${emailInput.value}`);
  emailInput.value = "";
}

function handleEndGame() {
  if (confirm("Terminer la partie ?")) {
    window.RosasGameState.calculateScores();
    
    const partyData = {
      code: window.RosasGameState.partyCode,
      players: window.RosasGameState.players,
      winner: window.RosasGameState.players[0],
      totalTurns: window.RosasGameState.totalTurns,
      startTime: window.RosasGameState.startTime,
      duration: Date.now() - (window.RosasGameState.startTime || Date.now())
    };
    
    window.RosasStorage.addPartyToHistory(partyData);
    window.RosasStorage.updateUserStat('gamesPlayed', 1);
    
    window.RosasUI.showScreen('screen-stats');
    
    if (window.RosasGameState.isOnline && window.RosasSyncRoom) {
      window.RosasSyncRoom.endGame();
    }
  }
}

function updateUIFromState(state) {
  if (state.activeRule) {
    const ruleElement = document.getElementById('active-rule-text');
    if (ruleElement) {
      ruleElement.textContent = state.activeRule;
    }
  }
  
  const turnCounter = document.getElementById('turn-counter');
  if (turnCounter) {
    turnCounter.textContent = `Tour ${state.totalTurns || 0}`;
  }
  
  if (state.timeLeft > 0) {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      const minutes = Math.floor(state.timeLeft / 60);
      const seconds = state.timeLeft % 60;
      timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
  }
}

// -------------------------
// SESSION ET RESTAURATION
// -------------------------
function restoreLastSession() {
  const lastSession = window.RosasStorage.loadLastSession();
  
  if (lastSession) {
    const shouldRestore = confirm("Reprendre la dernière partie ?");
    
    if (shouldRestore) {
      const savedState = window.RosasStorage.loadGameState();
      if (savedState) {
        window.RosasGameState.importState(JSON.stringify(savedState));
        window.RosasUI.showScreen('screen-game');
        window.RosasUI.showNotification("🔄", "Session restaurée", "Bienvenue de retour");
        
        // Initialiser les jauges après restauration
        setTimeout(() => {
          updateAllGauges();
          window.RosasSobrietyGauge.refreshGaugesVisibility();
        }, 100);
      }
    }
  }
  
  setInterval(() => {
    const sessionData = {
      timestamp: Date.now(),
      partyCode: window.RosasGameState.partyCode,
      playersCount: window.RosasGameState.players.length,
      currentScreen: window.RosasUI.currentScreen
    };
    window.RosasStorage.saveLastSession(sessionData);
  }, 30000);
}

// -------------------------
// ANIMATIONS ET EFFETS
// -------------------------
function startAmbientAnimations() {
  createAmbientParticles();
  
  setInterval(() => {
    if (Math.random() > 0.7) {
      window.RosasUI.createGoldenSparkles(3);
    }
  }, 5000);
  
  setInterval(() => {
    window.RosasUI.updateCountdown();
  }, 1000);
}

function createAmbientParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'ambient-particle';
    
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 100}vh`;
    particle.style.width = `${2 + Math.random() * 3}px`;
    particle.style.height = particle.style.width;
    particle.style.opacity = `${0.1 + Math.random() * 0.3}`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${10 + Math.random() * 20}s`;
    
    if (Math.random() > 0.8) {
      particle.style.background = 'var(--gold)';
    }
    
    container.appendChild(particle);
  }
}

// -------------------------
// MODAL DES PARAMÈTRES
// -------------------------
function showSettingsModal() {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:500px;background:rgba(0,0,0,0.95);border:2px solid var(--gold);">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
        <h3 style="color:var(--gold);margin:0;"><i class="fas fa-cog"></i> Paramètres</h3>
        <button class="button button-small" onclick="this.closest('.modal').remove()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div style="display:grid;gap:15px;">
        <div class="setting-item">
          <label><i class="fas fa-volume-up"></i> Sons</label>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <label><i class="fas fa-bell"></i> Notifications</label>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <label><i class="fas fa-moon"></i> Mode sombre</label>
          <label class="switch">
            <input type="checkbox">
            <span class="slider"></span>
          </label>
        </div>
        
        <div class="setting-item">
          <label><i class="fas fa-vibrate"></i> Vibration</label>
          <label class="switch">
            <input type="checkbox" checked>
            <span class="slider"></span>
          </label>
        </div>
        
        <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:15px;margin-top:10px;">
          <button class="button button-full" onclick="clearAllData()">
            <i class="fas fa-trash"></i> Effacer toutes les données
          </button>
          
          <button class="button button-full" onclick="exportBackup()" style="margin-top:10px;">
            <i class="fas fa-download"></i> Sauvegarder les données
          </button>
          
          <button class="button button-full" onclick="importBackup()" style="margin-top:10px;">
            <i class="fas fa-upload"></i> Restaurer une sauvegarde
          </button>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// -------------------------
// FONCTIONS DE DÉBOGAGE
// -------------------------
function clearAllData() {
  if (confirm("Effacer TOUTES les données ? Cette action est irréversible.")) {
    window.RosasStorage.clearAllData();
    window.location.reload();
  }
}

function exportBackup() {
  const backup = window.RosasStorage.exportBackup();
  const blob = new Blob([backup], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `rosas_backup_${Date.now()}.json`;
  a.click();
  
  window.RosasUI.showNotification("💾", "Sauvegarde", "Données exportées");
}

function importBackup() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const result = window.RosasStorage.importBackup(event.target.result);
      
      if (result.success) {
        window.RosasUI.showNotification("🔄", "Restauration", "Données restaurées");
        setTimeout(() => window.location.reload(), 1000);
      } else {
        window.RosasUI.showNotification("❌", "Erreur", result.error);
      }
    };
    
    reader.readAsText(file);
  };
  
  input.click();
}

// -------------------------
// EXPORT DES FONCTIONS GLOBALES
// -------------------------
window.RosasApp = {
  version: "2.1",
  state: window.RosasGameState,
  storage: window.RosasStorage,
  sync: window.RosasSyncRoom,
  ui: window.RosasUI,
  sobrietyGauge: window.RosasSobrietyGauge,
  whatsapp: window.RosasWhatsApp,
  
  startNewGame: handleStartGame,
  drawCard: handleDrawCard,
  nextTurn: handleNextTurn,
  showStats: () => window.RosasUI.showScreen('screen-stats'),
  showAlbum: () => window.RosasUI.showScreen('screen-album'),
  
  debug: {
    getState: () => window.RosasGameState.getStateSnapshot(),
    getStorageUsage: () => window.RosasStorage.getStorageUsage(),
    getConnectionStatus: () => window.RosasSyncRoom.getConnectionStatus()
  }
};

console.log("🎮 Rosas App 2.1 prête avec WhatsApp et Jauges !");