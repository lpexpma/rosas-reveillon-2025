// js/app.js
// Version 2.2 - Application Rosas Réveillon 2025 avec WhatsApp, Jauge de Sobriété et dépendances vérifiées

// -------------------------
// FONCTIONS UTILITAIRES GLOBALES
// -------------------------
function showFatalError(title, message) {
  console.error(`❌ FATAL ERROR: ${title} - ${message}`);
  
  const errorDiv = document.createElement('div');
  errorDiv.id = 'fatal-error';
  errorDiv.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(10, 10, 10, 0.98);
    color: #F7B306;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 99999;
    padding: 20px;
    text-align: center;
    font-family: 'Cinzel', serif;
  `;
  
  errorDiv.innerHTML = `
    <div style="font-size: 3rem; margin-bottom: 20px;">⚠️</div>
    <h1 style="color: #FF6B6B; font-size: 1.8rem; margin-bottom: 15px;">${title}</h1>
    <p style="color: var(--silver); max-width: 400px; line-height: 1.5;">${message}</p>
    <div style="margin-top: 30px; color: var(--silver-dark); font-size: 0.9rem;">
      <i class="fas fa-redo"></i> Rechargez la page pour réessayer
    </div>
  `;
  
  document.body.appendChild(errorDiv);
}

function waitForDependency(dependencyName, maxWait = 5000) {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkInterval = setInterval(() => {
      if (window[dependencyName]) {
        clearInterval(checkInterval);
        resolve(window[dependencyName]);
      } else if (Date.now() - startTime > maxWait) {
        clearInterval(checkInterval);
        reject(new Error(`Dépendance ${dependencyName} non chargée après ${maxWait}ms`));
      }
    }, 100);
  });
}

// -------------------------
// INITIALISATION
// -------------------------
document.addEventListener('DOMContentLoaded', () => {
  console.log("🎉 Rosas Réveillon 2025 - Version 2.2");
  
  // Vérifier les dépendances critiques
  checkCriticalDependencies()
    .then(() => {
      // Initialiser les modules globaux
      initializeApplication();
      
      // Configurer les événements
      setupGlobalEventListeners();
      
      // Vérifier et restaurer la dernière session
      restoreLastSession();
      
      // Démarrer les animations
      startAmbientAnimations();
      
      console.log("✅ Application initialisée avec succès");
    })
    .catch(error => {
      showFatalError("Erreur de chargement", error.message);
    });
});

async function checkCriticalDependencies() {
  console.log("🔍 Vérification des dépendances...");
  
  // Liste des dépendances critiques
  const criticalDeps = [
    'CARDS_DATABASE',
    'THEMES'
  ];
  
  // Vérifier chaque dépendance
  for (const dep of criticalDeps) {
    if (!window[dep]) {
      throw new Error(`La dépendance ${dep} n'a pas été chargée. Vérifiez l'ordre de chargement des scripts.`);
    }
  }
  
  console.log("✅ Toutes les dépendances sont chargées");
}

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
      const playerInfo = playerCard.querySelector('.player-info');
      if (playerInfo) {
        playerInfo.appendChild(gauge);
      }
    }
    
    const fill = gauge.querySelector('.gauge-fill');
    if (fill) {
      fill.style.width = `${percentage}%`;
      fill.className = `gauge-fill ${level.color}`;
    }
    
    const info = gauge.querySelector('.gauge-info');
    if (info) {
      const currentSips = info.querySelector('.current-sips');
      const gaugeStatus = info.querySelector('.gauge-status');
      
      if (currentSips) currentSips.textContent = `${sips} verres`;
      if (gaugeStatus) gaugeStatus.textContent = `${level.status} ${level.emoji}`;
    }
    
    this.updateVisibility();
  }

  createGaugeElement() {
    const container = document.createElement('div');
    container.className = 'sobriety-gauge-container player-gauge';
    
    const gaugeHTML = `
      <div class="gauge-header">
        <div class="gauge-title">
          <i class="fas fa-wine-glass-alt"></i>
          <span>Niveau d'ébriété</span>
        </div>
      </div>
      <div class="sobriety-gauge">
        <div class="gauge-fill gauge-level-0" style="width: 0%"></div>
      </div>
      <div class="gauge-info">
        <span class="current-sips">0 verres</span>
        <span class="gauge-status">Sobre 😎</span>
      </div>
    `;
    
    container.innerHTML = gaugeHTML;
    return container;
  }

  toggleVisibility() {
    this.visibleToAll = !this.visibleToAll;
    
    const gameContainer = document.querySelector('.game-container');
    const toggleBtn = document.querySelector('.gauge-visibility-toggle');
    
    if (this.visibleToAll) {
      if (gameContainer) gameContainer.classList.remove('gauges-hidden');
      if (toggleBtn) toggleBtn.textContent = '👁️ Masquer jauges';
    } else {
      if (gameContainer) gameContainer.classList.add('gauges-hidden');
      if (toggleBtn) toggleBtn.textContent = '👁️ Afficher toutes';
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

  refreshGaugesVisibility() {
    this.updateVisibility();
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
    if (!window.RosasGameState || !window.RosasGameState.getPhotos) {
      console.warn("⚠️ GameState non disponible pour le partage WhatsApp");
      return;
    }
    
    const photos = window.RosasGameState.getPhotos();
    const lastPhoto = photos?.[photos.length - 1];
    
    if (!lastPhoto) {
      if (window.RosasUI && window.RosasUI.showNotification) {
        window.RosasUI.showNotification("📸", "Aucune photo", "Prenez d'abord une photo");
      }
      return;
    }
    
    const partyCode = window.RosasGameState.partyCode || "ROSAS2025";
    const playerName = window.RosasGameState.getCurrentPlayer?.()?.name || "Anonyme";
    const mission = window.RosasGameState.currentPhotoMission || "Défi Rosas";
    
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
    
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('photosShared', 1);
    }
    
    if (window.RosasUI && window.RosasUI.showToast) {
      window.RosasUI.showToast("✅ Photo partagée au groupe WhatsApp", "success");
    } else if (window.RosasUI && window.RosasUI.showNotification) {
      window.RosasUI.showNotification("✅", "Photo partagée", "Envoyée au groupe WhatsApp");
    }
  }

  shareGameInvite(partyCode) {
    const playerName = window.RosasGameState?.currentUserPseudo || "Moi";
    
    const message = encodeURIComponent(
      `🎉 *Rejoins ma partie Rosas 2025 !*\n\n` +
      `🎮 *Code de la partie:* ${partyCode}\n` +
      `👤 *Hôte:* ${playerName}\n\n` +
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
async function initializeApplication() {
  console.log("🚀 Initialisation de l'application...");
  
  try {
    // Attendre que les modules critiques soient disponibles
    await waitForDependency('GameState', 3000);
    await waitForDependency('StorageLocal', 3000);
    await waitForDependency('UIManager', 3000);
    
    // Initialiser les instances globales si elles n'existent pas
    if (!window.RosasGameState) {
      window.RosasGameState = new GameState();
    }
    
    if (!window.RosasStorage) {
      window.RosasStorage = new StorageLocal();
    }
    
    if (!window.RosasUI) {
      window.RosasUI = new UIManager(window.RosasGameState);
    }
    
    // Initialiser les nouveaux managers
    window.RosasSobrietyGauge = new SobrietyGaugeManager();
    window.RosasWhatsApp = new WhatsAppSharingManager();
    
    // Configurer les callbacks
    setupCallbacks();
    
    // Charger les paramètres utilisateur
    loadUserSettings();
    
    // Initialiser l'interface utilisateur
    if (window.RosasUI.initialize) {
      window.RosasUI.initialize();
    }
    
    // Initialiser les jauges
    if (window.RosasSobrietyGauge) {
      window.RosasSobrietyGauge.init();
    }
    
    console.log("✅ Application initialisée avec WhatsApp et Jauges");
    
  } catch (error) {
    console.error("❌ Erreur d'initialisation:", error);
    throw error;
  }
}

// -------------------------
// GESTION DES PARAMÈTRES UTILISATEUR
// -------------------------
function loadUserSettings() {
  if (!window.RosasStorage || !window.RosasStorage.loadUserSettings) {
    console.warn("⚠️ Storage non disponible pour charger les paramètres");
    return;
  }
  
  const settings = window.RosasStorage.loadUserSettings();
  
  if (settings) {
    if (window.RosasGameState) {
      window.RosasGameState.currentUserPseudo = settings.pseudo || "";
      window.RosasGameState.userGender = settings.gender || "unknown";
    }
    
    if (window.RosasUI && window.RosasUI.updateWelcomeMessage) {
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
  if (!window.RosasStorage || !window.RosasStorage.saveUserSettings) {
    console.warn("⚠️ Storage non disponible pour sauvegarder les paramètres");
    return;
  }
  
  const pseudoInput = document.getElementById('user-pseudo');
  const gender = window.RosasGameState?.userGender || "unknown";
  
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
    
    if (window.RosasGameState) {
      window.RosasGameState.currentUserPseudo = settings.pseudo;
      window.RosasGameState.userGender = gender;
    }
    
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
    if (window.RosasUI && window.RosasUI.showScreen) {
      window.RosasUI.showScreen(screenId);
    }
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
    if (window.RosasWhatsApp) {
      window.RosasWhatsApp.shareCurrentPhoto();
    }
    return;
  }
  
  // WhatsApp invite button
  if (target.closest('#whatsapp-invite-btn')) {
    e.preventDefault();
    if (window.RosasWhatsApp && window.RosasGameState) {
      const partyCode = window.RosasGameState.partyCode;
      if (partyCode) {
        window.RosasWhatsApp.shareGameInvite(partyCode);
      }
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
    if (window.RosasUI && window.RosasUI.showScreen) {
      window.RosasUI.showScreen('screen-home');
    }
    return;
  }
  
  if (e.key === 'Enter') {
    const activeScreen = window.RosasUI?.currentScreen;
    
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
        if (partyCode && window.RosasWhatsApp) {
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
  if (window.RosasWhatsApp) {
    window.RosasWhatsApp.setupButton();
  }
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
      if (window.RosasUI) window.RosasUI.showScreen('screen-stats');
      break;
      
    case 'btn-show-album':
      if (window.RosasUI) window.RosasUI.showScreen('screen-album');
      break;
      
    case 'btn-show-settings':
      showSettingsModal();
      break;
      
    case 'btn-refresh-players':
      if (window.RosasUI) window.RosasUI.renderPlayers();
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
      if (window.RosasUI) window.RosasUI.renderPlayers();
      updateAllGauges();
    };
  }
  
  if (window.RosasGameState && window.RosasGameState.onCardUpdate) {
    window.RosasGameState.onCardUpdate = (card) => {
      if (window.RosasUI) window.RosasUI.displayCard(card);
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
  if (!window.RosasGameState) return;
  
  window.RosasGameState.onStateChange = (state) => {
    updateUIFromState(state);
    if (window.RosasStorage && window.RosasStorage.saveGameState) {
      window.RosasStorage.saveGameState(state);
    }
  };
  
  window.RosasGameState.onPlayersUpdate = (players) => {
    if (window.RosasUI) window.RosasUI.renderPlayers();
    if (window.RosasStorage && window.RosasStorage.savePlayersData) {
      window.RosasStorage.savePlayersData(players);
    }
    updateAllGauges();
  };
  
  window.RosasGameState.onCardUpdate = (card) => {
    if (window.RosasUI) window.RosasUI.displayCard(card);
    if (card && window.RosasStorage && window.RosasStorage.updateCardStat) {
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
  if (window.RosasUI) {
    window.RosasUI.showScreen('screen-join');
  }
}

function handleCreateParty() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const pseudo = window.RosasGameState.currentUserPseudo;
  if (!pseudo) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
      window.RosasUI.showScreen('screen-pseudo');
    }
    return;
  }
  
  const partyCode = generateRandomCode(6);
  
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
  
  if (window.RosasUI) {
    window.RosasUI.showScreen('screen-lobby');
    window.RosasUI.showNotification("🎉", "Partie créée", `Code: ${partyCode}`);
  }
  
  // Ajouter le bouton WhatsApp dans le lobby
  setTimeout(() => {
    const lobbyControls = document.querySelector('.lobby-controls');
    if (lobbyControls && !document.getElementById('whatsapp-invite-btn')) {
      const btn = document.createElement('button');
      btn.id = 'whatsapp-invite-btn';
      btn.className = 'button button-whatsapp';
      btn.innerHTML = '<i class="whatsapp-icon">📱</i> Inviter via WhatsApp';
      btn.addEventListener('click', () => {
        if (window.RosasWhatsApp) {
          window.RosasWhatsApp.shareGameInvite(partyCode);
        }
      });
      lobbyControls.appendChild(btn);
    }
  }, 100);
}

function handleJoinParty() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const pseudo = window.RosasGameState.currentUserPseudo;
  const codeInput = document.getElementById('join-code');
  
  if (!pseudo) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Erreur", "Choisis un pseudo d'abord");
      window.RosasUI.showScreen('screen-pseudo');
    }
    return;
  }
  
  if (!codeInput || !codeInput.value.trim()) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Erreur", "Entre un code de partie");
    }
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
  
  if (window.RosasUI) {
    window.RosasUI.showScreen('screen-lobby');
    window.RosasUI.showNotification("✅", "Partie rejointe", `Code: ${partyCode}`);
  }
}

function handleStartGame() {
  if (!window.RosasGameState || !window.RosasUI) {
    console.error("❌ GameState ou UI non disponible");
    return;
  }
  
  if (window.RosasGameState.players.length < 2) {
    window.RosasUI.showNotification("⏳", "En attente", "Il faut au moins 2 joueurs");
    return;
  }
  
  if (window.RosasGameState.initializeCards) {
    window.RosasGameState.initializeCards();
  }
  
  if (window.RosasGameState.startGame()) {
    if (window.RosasGameState.isOnline && window.RosasSyncRoom) {
      window.RosasSyncRoom.startGame();
    }
    
    window.RosasUI.showScreen('screen-game');
    window.RosasUI.showNotification("🎲", "C'est parti !", "À toi de jouer");
    
    // Initialiser les jauges
    setTimeout(() => {
      updateAllGauges();
      if (window.RosasSobrietyGauge) {
        window.RosasSobrietyGauge.refreshGaugesVisibility();
      }
    }, 100);
  }
}

function handleDrawCard() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  
  if (!currentPlayer) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Erreur", "Aucun joueur actif");
    }
    return;
  }
  
  const card = window.RosasGameState.drawCard();
  
  if (card) {
    if (window.RosasStorage) {
      if (window.RosasStorage.updateUserStat) {
        window.RosasStorage.updateUserStat('cardsDrawn', 1);
      }
      if (window.RosasStorage.updateThemeUsage) {
        window.RosasStorage.updateThemeUsage(card.theme);
      }
    }
    
    if (card.drink > 0) {
      window.RosasGameState.updatePlayerSips(currentPlayer.id, card.drink);
      if (window.RosasStorage && window.RosasStorage.updateUserStat) {
        window.RosasStorage.updateUserStat('sipsTaken', card.drink);
      }
    }
  }
}

function handlePassTurn() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const currentCard = window.RosasGameState.currentCard;
  
  if (!currentCard || !currentCard.canPass) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Impossible", "Cette carte ne peut pas être passée");
    }
    return;
  }
  
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  if (currentPlayer) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, 1);
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('sipsTaken', 1);
    }
  }
  
  handleNextTurn();
}

function handleValidateCard() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
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
  
  if (window.RosasUI && window.RosasUI.handlePhotoSelected) {
    window.RosasUI.handlePhotoSelected(file);
  }
}

function saveCurrentPhoto() {
  const previewImg = document.getElementById('photo-preview');
  
  if (!previewImg || !previewImg.dataset.pending) {
    if (window.RosasUI) {
      window.RosasUI.showNotification("❌", "Erreur", "Aucune photo sélectionnée");
    }
    return null;
  }
  
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return null;
  }
  
  const photoData = {
    dataUrl: previewImg.dataset.pending,
    playerName: window.RosasGameState.getCurrentPlayer()?.name || "Anonyme",
    mission: window.RosasGameState.currentPhotoMission
  };
  
  if (window.RosasGameState.addPhoto) {
    window.RosasGameState.addPhoto(photoData);
  }
  
  if (window.RosasStorage && window.RosasStorage.updateUserStat) {
    window.RosasStorage.updateUserStat('photosTaken', 1);
  }
  
  return photoData;
}

function handleSavePhoto() {
  const photoData = saveCurrentPhoto();
  if (photoData) {
    handleNextTurn();
    if (window.RosasUI) {
      window.RosasUI.showNotification("📸", "Photo enregistrée", "Ajoutée à l'album");
    }
  }
}

function handleSkipPhoto() {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  if (currentPlayer) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, 2);
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('sipsTaken', 2);
    }
  }
  
  handleNextTurn();
}

// -------------------------
// GESTION DU DÉ
// -------------------------
function handleRollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  
  if (window.RosasUI) {
    window.RosasUI.showNotification("🎲", `Dé: ${result}`, "Résultat du lancer");
  }
  
  applyDiceEffect(result);
  
  setTimeout(() => {
    handleNextTurn();
  }, 2000);
}

function applyDiceEffect(result) {
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
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
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const currentCard = window.RosasGameState.currentCard;
  const currentPlayer = window.RosasGameState.getCurrentPlayer();
  
  if (!currentCard || !currentPlayer) return;
  
  if (yes) {
    window.RosasGameState.updatePlayerSips(currentPlayer.id, currentCard.drink || 1);
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('sipsTaken', currentCard.drink || 1);
    }
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
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  const nextPlayer = window.RosasGameState.nextPlayer();
  
  if (nextPlayer && window.RosasUI) {
    window.RosasUI.updateCurrentPlayerInfo();
    window.RosasUI.renderPlayers();
    
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('totalTurns', 1);
    }
    
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
  if (!window.RosasGameState) {
    console.error("❌ GameState non disponible");
    return;
  }
  
  if (window.RosasUI) {
    window.RosasUI.showNotification("🥂", "Distribution", `Distribue ${amount} gorgée(s)`);
  }
  
  const otherPlayers = window.RosasGameState.players.filter(p => p.id !== fromPlayer.id);
  if (otherPlayers.length > 0) {
    const randomPlayer = otherPlayers[Math.floor(Math.random() * otherPlayers.length)];
    window.RosasGameState.updatePlayerSips(randomPlayer.id, amount);
    if (window.RosasStorage && window.RosasStorage.updateUserStat) {
      window.RosasStorage.updateUserStat('sipsGiven', amount);
    }
  }
}

function updateAllGauges() {
  if (!window.RosasSobrietyGauge || !window.RosasGameState) return;
  
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
// UTILITAIRES
// -------------------------
function generateRandomCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function handleAction(action, target) {
  console.log(`Action: ${action}`, target);
  // Implémenter les actions spécifiques ici
}

// -------------------------
// SESSION ET RESTAURATION
// -------------------------
function restoreLastSession() {
  if (!window.RosasStorage || !window.RosasStorage.loadLastSession) {
    console.warn("⚠️ Storage non disponible pour restaurer la session");
    return;
  }
  
  const lastSession = window.RosasStorage.loadLastSession();
  
  if (lastSession) {
    const shouldRestore = confirm("Reprendre la dernière partie ?");
    
    if (shouldRestore && window.RosasStorage.loadGameState) {
      const savedState = window.RosasStorage.loadGameState();
      if (savedState && window.RosasGameState && window.RosasGameState.importState) {
        window.RosasGameState.importState(JSON.stringify(savedState));
        
        if (window.RosasUI) {
          window.RosasUI.showScreen('screen-game');
          window.RosasUI.showNotification("🔄", "Session restaurée", "Bienvenue de retour");
        }
        
        // Initialiser les jauges après restauration
        setTimeout(() => {
          updateAllGauges();
          if (window.RosasSobrietyGauge) {
            window.RosasSobrietyGauge.refreshGaugesVisibility();
          }
        }, 100);
      }
    }
  }
  
  // Sauvegarder périodiquement la session
  setInterval(() => {
    if (window.RosasStorage && window.RosasStorage.saveLastSession) {
      const sessionData = {
        timestamp: Date.now(),
        partyCode: window.RosasGameState?.partyCode || "",
        playersCount: window.RosasGameState?.players?.length || 0,
        currentScreen: window.RosasUI?.currentScreen || ""
      };
      window.RosasStorage.saveLastSession(sessionData);
    }
  }, 30000);
}

// -------------------------
// ANIMATIONS ET EFFETS
// -------------------------
function startAmbientAnimations() {
  createAmbientParticles();
  
  setInterval(() => {
    if (Math.random() > 0.7 && window.RosasUI && window.RosasUI.createGoldenSparkles) {
      window.RosasUI.createGoldenSparkles(3);
    }
  }, 5000);
  
  setInterval(() => {
    if (window.RosasUI && window.RosasUI.updateCountdown) {
      window.RosasUI.updateCountdown();
    }
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
// EXPORT DES FONCTIONS GLOBALES
// -------------------------
window.RosasApp = {
  version: "2.2",
  state: window.RosasGameState,
  storage: window.RosasStorage,
  sync: window.RosasSyncRoom,
  ui: window.RosasUI,
  sobrietyGauge: window.RosasSobrietyGauge,
  whatsapp: window.RosasWhatsApp,
  
  startNewGame: handleStartGame,
  drawCard: handleDrawCard,
  nextTurn: handleNextTurn,
  showStats: () => window.RosasUI?.showScreen('screen-stats'),
  showAlbum: () => window.RosasUI?.showScreen('screen-album'),
  
  debug: {
    getState: () => window.RosasGameState?.getStateSnapshot?.(),
    getStorageUsage: () => window.RosasStorage?.getStorageUsage?.(),
    getConnectionStatus: () => window.RosasSyncRoom?.getConnectionStatus?.()
  }
};

console.log("🎮 Rosas App 2.2 prête avec WhatsApp et Jauges !");