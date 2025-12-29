// js/ui-manager.js
// Gestionnaire d'interface utilisateur pour Rosas

// -------------------------
// CLASSE UI MANAGER
// -------------------------
class UIManager {
  constructor(gameState) {
    this.gameState = gameState;
    this.currentScreen = null;
    this.notifications = [];
    this.animations = new Map();
    
    // Références aux éléments DOM
    this.elements = {
      screens: {},
      buttons: {},
      containers: {}
    };
    
    // État de l'UI
    this.uiState = {
      goldenSparklesActive: false,
      particlesActive: false,
      countdownActive: true,
      themeColors: {
        HUMOUR: { primary: '#FF6B6B', secondary: '#FFD166' },
        SEXY: { primary: '#EF476F', secondary: '#7209B7' },
        ACTION: { primary: '#06D6A0', secondary: '#118AB2' },
        POLL: { primary: '#FFD166', secondary: '#FF6B6B' },
        DINGUE: { primary: '#7209B7', secondary: '#EF476F' },
        DICE: { primary: '#118AB2', secondary: '#06D6A0' },
        PHOTO: { primary: '#4ECDC4', secondary: '#FFD166' },
        NEVER: { primary: '#073B4C', secondary: '#4ECDC4' },
        RULE: { primary: '#6A994E', secondary: '#A7C957' }
      }
    };
    
    console.log("🎨 UIManager initialisé");
  }
  
  // -------------------------
  // INITIALISATION
  // -------------------------
  
  // Initialiser l'UI
  initialize() {
    this.cacheElements();
    this.setupEventListeners();
    this.initializeVisualEffects();
    this.updateCountdown();
    
    console.log("✅ UI Manager initialisé");
  }
  
  // Mettre en cache les éléments DOM
  cacheElements() {
    // Écrans
    document.querySelectorAll('.screen').forEach(screen => {
      this.elements.screens[screen.id] = screen;
    });
    
    // Boutons principaux
    const buttonIds = [
      'btn-continue', 'btn-join', 'copy-link', 'btn-start-game',
      'btn-draw', 'btn-pass', 'btn-pass2', 'btn-validate',
      'btn-photo-save', 'btn-photo-skip', 'btn-album-send',
      'btn-roll-dice', 'btn-yes', 'btn-no'
    ];
    
    buttonIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.elements.buttons[id] = el;
    });
    
    // Conteneurs
    const containerIds = [
      'players', 'counters', 'themes', 'album-grid',
      'card-content', 'card-actions', 'dice-rules',
      'active-rule', 'photo-preview', 'game-stats',
      'particles', 'notifications-container'
    ];
    
    containerIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) this.elements.containers[id] = el;
    });
    
    // Champs de texte
    this.elements.inputs = {
      userPseudo: document.getElementById('user-pseudo'),
      joinCode: document.getElementById('join-code'),
      albumEmail: document.getElementById('album-email'),
      photoInput: document.getElementById('photo-input')
    };
    
    console.log("🔍 Éléments DOM mis en cache");
  }
  
  // -------------------------
  // GESTION DES ÉCRANS
  // -------------------------
  
  // Afficher un écran
  showScreen(screenId) {
    // Cacher tous les écrans
    Object.values(this.elements.screens).forEach(screen => {
      screen.classList.remove('active');
      screen.style.display = 'none';
    });
    
    // Afficher l'écran demandé
    const targetScreen = this.elements.screens[screenId];
    if (targetScreen) {
      targetScreen.classList.add('active');
      targetScreen.style.display = 'block';
      this.currentScreen = screenId;
      
      // Exécuter des actions spécifiques à l'écran
      this.onScreenShow(screenId);
      
      console.log(`📱 Écran affiché: ${screenId}`);
    } else {
      console.error(`❌ Écran non trouvé: ${screenId}`);
    }
  }
  
  // Actions lors de l'affichage d'un écran
  onScreenShow(screenId) {
    switch(screenId) {
      case 'screen-home':
        this.updateWelcomeMessage();
        break;
        
      case 'screen-join':
        this.updateCurrentPseudo();
        break;
        
      case 'screen-lobby':
        this.updateLobbyInfo();
        break;
        
      case 'screen-game':
        this.updateCurrentPlayerInfo();
        this.renderThemes();
        break;
        
      case 'screen-card':
        this.createGoldenSparkles();
        break;
        
      case 'screen-photo':
        this.updatePhotoMission();
        break;
        
      case 'screen-album':
        this.renderAlbum();
        this.createGoldenSparkles();
        break;
        
      case 'screen-stats':
        this.displayGameStats();
        break;
    }
  }
  
  // -------------------------
  // AFFICHAGE DES JOUEURS
  // -------------------------
  
  // Afficher les joueurs
  renderPlayers() {
    const playersEl = this.elements.containers.players;
    const countersEl = this.elements.containers.counters;
    
    if (!playersEl || !countersEl) return;
    
    playersEl.innerHTML = '';
    countersEl.innerHTML = '';
    
    if (this.gameState.players.length === 0) {
      const emptyMessage = document.createElement('div');
      emptyMessage.className = 'empty-message';
      emptyMessage.innerHTML = `
        <i class="fas fa-users" style="font-size:2rem;color:var(--silver-dark);margin-bottom:10px;"></i>
        <div style="color:var(--silver);">Aucun joueur pour le moment</div>
      `;
      playersEl.appendChild(emptyMessage);
      return;
    }
    
    // Trier par ordre d'arrivée
    const orderedPlayers = [...this.gameState.players]
      .sort((a, b) => (a.joinedAt || 0) - (b.joinedAt || 0));
    
    orderedPlayers.forEach((player, index) => {
      const currentPlayer = this.gameState.getCurrentPlayer();
      const isActive = player.id === currentPlayer?.id;
      
      // Carte joueur
      const playerCard = this.createPlayerCard(player, isActive, index + 1);
      playersEl.appendChild(playerCard);
      
      // Copie pour le compteur
      const counterCard = playerCard.cloneNode(true);
      counterCard.classList.remove('active');
      countersEl.appendChild(counterCard);
    });
  }
  
  // Créer une carte joueur
  createPlayerCard(player, isActive, position) {
    const card = document.createElement('div');
    card.className = `player ${isActive ? 'active' : ''}`;
    
    // Avatar couleur basée sur le nom
    const avatarColor = this.getAvatarColor(player.name);
    const initials = this.getPlayerInitials(player.name);
    
    card.innerHTML = `
      <div class="player-avatar" style="background:${avatarColor}">
        ${initials}
      </div>
      <div class="player-info">
        <div class="player-name">${this.escapeHtml(player.name)}</div>
        <div class="player-meta">
          <span class="player-sips">🥂 ${player.sips || 0}</span>
          <span class="player-position">#${position}</span>
        </div>
      </div>
      ${player.isHost ? '<div class="host-badge"><i class="fas fa-crown"></i></div>' : ''}
    `;
    
    // Animation pour le joueur actif
    if (isActive) {
      this.addPulseAnimation(card);
    }
    
    return card;
  }
  
  // -------------------------
  // AFFICHAGE DES THÈMES
  // -------------------------
  
  // Afficher les thèmes
  renderThemes() {
    const themesEl = this.elements.containers.themes;
    if (!themesEl) return;
    
    themesEl.innerHTML = '';
    
    window.THEMES.forEach(theme => {
      const themeOption = this.createThemeOption(theme);
      themesEl.appendChild(themeOption);
    });
  }
  
  // Créer une option de thème
  createThemeOption(theme) {
    const div = document.createElement('div');
    div.className = `theme-option ${theme.key === this.gameState.selectedTheme ? 'selected' : ''}`;
    
    const colors = this.uiState.themeColors[theme.key] || this.uiState.themeColors.HUMOUR;
    
    div.style.borderColor = colors.primary;
    div.style.background = `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`;
    
    div.innerHTML = `
      <div class="theme-icon" style="color:${colors.primary}">${theme.icon}</div>
      <div class="theme-name" style="color:${colors.primary}">${theme.label}</div>
    `;
    
    div.addEventListener('click', () => {
      this.gameState.selectedTheme = theme.key;
      this.renderThemes();
      
      // Animation de sélection
      this.createGoldenSparkles();
    });
    
    return div;
  }
  
  // -------------------------
  // AFFICHAGE DES CARTES
  // -------------------------
  
  // Afficher une carte
  displayCard(card) {
    if (!card) return;
    
    const cardThemeEl = document.getElementById('card-theme');
    const cardContentEl = this.elements.containers['card-content'];
    const cardActionsEl = this.elements.containers['card-actions'];
    const diceRulesEl = this.elements.containers['dice-rules'];
    const activeRuleBox = this.elements.containers['active-rule'];
    
    if (!cardContentEl || !cardActionsEl) return;
    
    // Thème de la carte
    const themeMeta = window.THEMES.find(t => t.key === card.theme);
    const themeColors = this.uiState.themeColors[card.theme] || this.uiState.themeColors.HUMOUR;
    
    if (cardThemeEl) {
      cardThemeEl.innerHTML = `
        <span style="color:${themeColors.primary}">${themeMeta?.icon ?? "🎴"}</span>
        <span>${themeMeta?.label ?? "Carte"}</span>
      `;
    }
    
    // Contenu de la carte
    cardContentEl.innerHTML = card.text;
    cardContentEl.style.borderColor = themeColors.primary;
    cardContentEl.style.background = `linear-gradient(135deg, ${themeColors.primary}10, ${themeColors.secondary}10)`;
    
    // Gestion des règles du dé
    if (diceRulesEl) {
      diceRulesEl.style.display = card.theme === "DICE" ? "block" : "none";
    }
    
    // Gestion des règles actives
    if (activeRuleBox) {
      const activeRuleText = document.getElementById('active-rule-text');
      if (card.rule && activeRuleText) {
        activeRuleBox.style.display = "block";
        activeRuleText.textContent = card.rule;
        activeRuleText.style.color = themeColors.primary;
      } else {
        activeRuleBox.style.display = "none";
      }
    }
    
    // Interface selon le type de carte
    cardActionsEl.innerHTML = '';
    
    switch(card.ui) {
      case "plain":
        break;
        
      case "dice":
        this.createDiceInterface(cardActionsEl, themeColors);
        break;
        
      case "photo":
        this.showScreen("screen-photo");
        this.updatePhotoMission(card.text);
        return;
        
      case "poll":
        this.createPollInterface(card, cardActionsEl, themeColors);
        break;
        
      case "designate":
        this.createDesignateInterface(card, cardActionsEl, themeColors);
        break;
        
      case "rule":
        break;
        
      case "never":
        this.createNeverInterface(card, cardActionsEl, themeColors);
        break;
    }
    
    // Bouton PASS
    const passBtn = document.getElementById('btn-pass2');
    if (passBtn) {
      passBtn.style.display = card.canPass ? "block" : "none";
    }
    
    // Afficher l'écran de carte
    this.showScreen("screen-card");
    this.createGoldenSparkles();
  }
  
  // Interface pour le dé
  createDiceInterface(container, colors) {
    container.innerHTML = `
      <div class="row" style="justify-content:center;margin-top:15px;">
        <button class="button dice-button" id="btn-roll-dice" 
                style="background:${colors.primary}20;color:${colors.primary};border:1px solid ${colors.primary}50">
          <i class="fas fa-dice" style="margin-right:8px;"></i> LANCER LE DÉ
        </button>
      </div>
    `;
  }
  
  // Interface pour le sondage
  createPollInterface(card, container, colors) {
    const optionsHTML = card.options?.map((option, index) => `
      <button class="button button-secondary poll-option" data-index="${index}"
              style="border-color:${colors.secondary}50">
        ${option}
      </button>
    `).join('') || '';
    
    container.innerHTML = `
      <div style="display:grid;gap:12px;margin-top:15px;">
        ${optionsHTML}
      </div>
    `;
  }
  
  // Interface pour désigner un joueur
  createDesignateInterface(card, container, colors) {
    const playersHTML = this.gameState.players.map(player => `
      <button class="button button-secondary player-designate" data-player-id="${player.id}"
              style="border-color:${colors.secondary}50">
        ${player.name}
      </button>
    `).join('');
    
    container.innerHTML = `
      <div style="display:grid;gap:12px;margin-top:15px;">
        ${playersHTML}
      </div>
    `;
  }
  
  // Interface pour "Je n'ai jamais"
  createNeverInterface(card, container, colors) {
    container.innerHTML = `
      <div class="row" style="justify-content:center;gap:15px;margin-top:15px;">
        <button class="button" id="btn-yes" 
                style="background:rgba(0,200,0,0.2);color:#A5FFA5;border:1px solid rgba(0,200,0,0.4)">
          <i class="fas fa-check-circle"></i> OUI
        </button>
        <button class="button" id="btn-no"  
                style="background:rgba(255,80,80,0.2);color:#FFA5A5;border:1px solid rgba(255,80,80,0.4)">
          <i class="fas fa-times-circle"></i> NON
        </button>
      </div>
    `;
  }
  
  // -------------------------
  // NOTIFICATIONS
  // -------------------------
  
  // Afficher une notification
  showNotification(icon, title, message, duration = 2000, callback = null) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    // Position aléatoire pour éviter les superpositions
    const posX = 50 + (Math.random() * 20 - 10); // 40-60%
    const posY = 50 + (Math.random() * 20 - 10); // 40-60%
    
    notification.style.cssText = `
      position: fixed;
      top: ${posY}%;
      left: ${posX}%;
      transform: translate(-50%, -50%);
      background: rgba(0,0,0,0.95);
      color: var(--gold);
      padding: 20px 25px;
      border-radius: 15px;
      border: 2px solid var(--gold);
      z-index: 10000;
      font-family: 'Cinzel', serif;
      text-align: center;
      max-width: 90%;
      box-shadow: 0 0 40px rgba(247, 179, 6, 0.5);
      opacity: 0;
      transition: opacity 0.3s, transform 0.3s;
    `;
    
    notification.innerHTML = `
      <div style="font-size:2rem;margin-bottom:10px;">${icon}</div>
      <div style="font-size:1.1rem;margin-bottom:10px;">${title}</div>
      <div style="font-size:0.9rem;color:var(--silver);">
        <i class="fas fa-glass-cheers"></i> ${message}
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = `translate(-50%, calc(-50% - 10px))`;
    });
    
    // Supprimer après la durée
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = `translate(-50%, -50%)`;
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        if (callback) callback();
      }, 300);
    }, duration);
    
    console.log(`📢 Notification: ${title} - ${message}`);
  }
  
  // -------------------------
  // ALBUM PHOTO
  // -------------------------
  
  // Afficher l'album
  renderAlbum() {
    const grid = this.elements.containers['album-grid'];
    if (!grid) return;
    
    grid.innerHTML = '';
    
    if (!this.gameState.photos || this.gameState.photos.length === 0) {
      grid.innerHTML = `
        <div class="empty-album">
          <i class="fas fa-images"></i>
          <div>L'album se remplira au fil de la soirée</div>
        </div>
      `;
      return;
    }
    
    // Afficher les 9 dernières photos
    this.gameState.photos.slice(-9).reverse().forEach(photo => {
      const img = document.createElement('img');
      img.className = 'album-thumb';
      img.src = photo.dataUrl;
      img.alt = 'Souvenir Rosas';
      img.title = `${photo.playerName} - ${new Date(photo.timestamp).toLocaleTimeString()}`;
      
      // Effet au survol
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
        img.style.zIndex = '10';
      });
      
      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
        img.style.zIndex = '1';
      });
      
      grid.appendChild(img);
    });
  }
  
  // Mettre à jour la mission photo
  updatePhotoMission(mission = null) {
    const missionText = mission || this.gameState.currentPhotoMission;
    const promptEl = document.getElementById('photo-prompt');
    
    if (promptEl && missionText) {
      promptEl.innerHTML = missionText;
    }
  }
  
  // Gérer la sélection d'une photo
  handlePhotoSelected(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.getElementById('photo-preview');
      if (img) {
        img.src = e.target.result;
        img.style.display = 'block';
        img.dataset.pending = e.target.result;
        
        // Animation
        img.style.animation = 'fadeIn 0.5s';
      }
    };
    reader.readAsDataURL(file);
  }
  
  // -------------------------
  // STATISTIQUES
  // -------------------------
  
  // Afficher les statistiques du jeu
  displayGameStats() {
    const statsEl = this.elements.containers['game-stats'];
    if (!statsEl) return;
    
    const stats = this.gameState.getCardsStats ? this.gameState.getCardsStats() : { totalCards: 286, usedCards: 0, remainingCards: 286, progress: 0 };
    const ranking = this.gameState.getRanking ? this.gameState.getRanking() : [];
    
    statsEl.innerHTML = `
      <div class="stats-container">
        <div class="stats-header">
          <i class="fas fa-chart-bar"></i>
          <h3>Statistiques de la soirée</h3>
        </div>
        
        <div class="stats-progress">
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${stats.progress}%"></div>
          </div>
          <div class="progress-text">
            ${stats.progress}% - ${stats.usedCards}/${stats.totalCards} cartes
          </div>
        </div>
        
        ${ranking.length > 0 ? `
        <div class="stats-ranking">
          <h4><i class="fas fa-trophy"></i> Classement</h4>
          <div class="ranking-list">
            ${ranking.map((player, index) => `
              <div class="ranking-item ${index === 0 ? 'first' : ''}">
                <div class="ranking-rank">#${player.rank}</div>
                <div class="ranking-name">${player.name}</div>
                <div class="ranking-sips">🥂 ${player.sips}</div>
              </div>
            `).join('')}
          </div>
        </div>
        ` : ''}
        
        <div class="stats-meta">
          <div class="meta-item">
            <i class="fas fa-users"></i>
            <span>${this.gameState.players.length} joueurs</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-redo"></i>
            <span>${this.gameState.totalTurns || 0} tours</span>
          </div>
          <div class="meta-item">
            <i class="fas fa-camera"></i>
            <span>${this.gameState.photos?.length || 0} photos</span>
          </div>
        </div>
      </div>
    `;
  }
  
  // -------------------------
  // EFFETS VISUELS
  // -------------------------
  
  // Initialiser les effets visuels
  initializeVisualEffects() {
    this.createParticles();
    
    // Mettre à jour le compte à rebours toutes les secondes
    if (this.uiState.countdownActive) {
      this.updateCountdown();
      setInterval(() => this.updateCountdown(), 1000);
    }
  }
  
  // Créer des particules flottantes
  createParticles() {
    const container = this.elements.containers.particles;
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Position aléatoire
      particle.style.left = Math.random() * 100 + 'vw';
      
      // Taille aléatoire
      const size = 2 + Math.random() * 5;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      // Opacité aléatoire
      particle.style.opacity = 0.3 + Math.random() * 0.5;
      
      // Délai et durée d'animation
      const delay = Math.random() * 15;
      const duration = 10 + Math.random() * 20;
      particle.style.animationDelay = delay + 's';
      particle.style.animationDuration = duration + 's';
      
      // Couleur parfois argentée
      if (Math.random() > 0.7) {
        particle.style.background = 'var(--silver)';
      }
      
      container.appendChild(particle);
    }
    
    this.uiState.particlesActive = true;
  }
  
  // Créer des étincelles dorées
  createGoldenSparkles(count = 12) {
    for (let i = 0; i < count; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'golden-sparkle';
      
      sparkle.style.cssText = `
        position: fixed;
        left: ${10 + Math.random() * 80}vw;
        top: ${10 + Math.random() * 80}vh;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: radial-gradient(circle, var(--gold) 30%, transparent 70%);
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 0 15px var(--gold);
      `;
      
      document.body.appendChild(sparkle);
      
      // Animation
      const animation = sparkle.animate([
        { transform: 'scale(0.5)', opacity: 0 },
        { transform: 'scale(1.2)', opacity: 1, offset: 0.3 },
        { transform: 'scale(0)', opacity: 0 }
      ], { 
        duration: 1200 + Math.random() * 600, 
        easing: 'ease-out' 
      });
      
      // Supprimer après l'animation
      animation.onfinish = () => {
        if (sparkle.parentNode) {
          sparkle.parentNode.removeChild(sparkle);
        }
      };
    }
  }
  
  // Ajouter une animation de pulsation
  addPulseAnimation(element) {
    element.style.animation = 'pulse 2s infinite';
    
    // Arrêter après 10 secondes
    setTimeout(() => {
      element.style.animation = '';
    }, 10000);
  }
  
  // Mettre à jour le compte à rebours
  updateCountdown() {
    const now = new Date();
    const newYear = new Date(2026, 0, 1, 0, 0, 0);
    const diff = newYear - now;
    
    const countdownElements = document.querySelectorAll('[data-countdown="true"]');
    
    if (diff <= 0) {
      countdownElements.forEach(el => {
        el.innerHTML = `
          <i class="fas fa-champagne-glasses"></i> 
          <span style="color:var(--gold);font-weight:bold;">BONNE ANNÉE 2026 !</span>
          <i class="fas fa-champagne-glasses"></i>
        `;
      });
      return;
    }
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownElements.forEach(el => {
      el.innerHTML = `
        <i class="fas fa-clock"></i> 
        <span style="color:var(--gold-light);">${hours.toString().padStart(2, '0')}h 
        ${minutes.toString().padStart(2, '0')}m 
        ${seconds.toString().padStart(2, '0')}s</span>
        <span style="color:var(--silver);"> avant 2026</span>
      `;
    });
  }
  
  // -------------------------
  // MISE À JOUR DES INFORMATIONS
  // -------------------------
  
  // Mettre à jour le message de bienvenue
  updateWelcomeMessage() {
    if (this.gameState.currentUserPseudo) {
      const nameDisplay = document.getElementById('player-name-display');
      const welcomeMessage = document.getElementById('welcome-message');
      
      if (nameDisplay) {
        nameDisplay.textContent = this.gameState.currentUserPseudo;
      }
      if (welcomeMessage) {
        welcomeMessage.textContent = `Bienvenue ${this.gameState.currentUserPseudo}`;
      }
    }
  }
  
  // Mettre à jour le pseudo courant
  updateCurrentPseudo() {
    const currentPseudo = document.getElementById('current-pseudo');
    if (currentPseudo) {
      currentPseudo.textContent = this.gameState.currentUserPseudo;
    }
  }
  
  // Mettre à jour les informations du lobby
  updateLobbyInfo() {
    const playerCount = document.getElementById('player-count');
    const startBtn = document.getElementById('btn-start-game');
    
    if (playerCount) {
      playerCount.textContent = this.gameState.players.length;
    }
    
    if (startBtn) {
      const canStart = this.gameState.players.length >= 2 && 
                      this.gameState.players.length <= 8;
      
      startBtn.disabled = !canStart;
      
      if (canStart) {
        startBtn.innerHTML = '<i class="fas fa-play-circle" style="margin-right:8px;"></i> COMMENCER LA SOIRÉE';
        startBtn.classList.remove('disabled');
      } else {
        if (this.gameState.players.length < 2) {
          startBtn.innerHTML = '<i class="fas fa-users" style="margin-right:8px;"></i> EN ATTENTE DE JOUEURS (2 min.)';
        } else {
          startBtn.innerHTML = '<i class="fas fa-ban" style="margin-right:8px;"></i> SALON COMPLET (8 max)';
        }
        startBtn.classList.add('disabled');
      }
    }
  }
  
  // Mettre à jour les informations du joueur courant
  updateCurrentPlayerInfo() {
    const currentPlayer = this.gameState.getCurrentPlayer();
    const currentPlayerEl = document.getElementById('current-player-name');
    
    if (currentPlayerEl && currentPlayer) {
      currentPlayerEl.textContent = currentPlayer.name;
    }
  }
  
  // -------------------------
  // ÉCOUTEURS D'ÉVÉNEMENTS
  // -------------------------
  
  // Configurer les écouteurs d'événements
  setupEventListeners() {
    // Navigation globale
    document.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) {
        e.preventDefault();
        this.showScreen(nav.getAttribute('data-nav'));
      }
    });
    
    // Gestion du clavier
    document.addEventListener('keydown', (e) => {
      // Échap pour revenir à l'accueil
      if (e.key === 'Escape') {
        this.showScreen('screen-home');
      }
      
      // Entrée pour valider dans certains écrans
      if (e.key === 'Enter') {
        const activeScreen = this.currentScreen;
        
        if (activeScreen === 'screen-pseudo') {
          const continueBtn = this.elements.buttons['btn-continue'];
          if (continueBtn) continueBtn.click();
        } else if (activeScreen === 'screen-join') {
          const joinBtn = this.elements.buttons['btn-join'];
          if (joinBtn) joinBtn.click();
        }
      }
    });
    
    console.log("🎯 Écouteurs d'événements configurés");
  }
  
  // -------------------------
  // UTILITAIRES
  // -------------------------
  
  // Échapper le HTML
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  // Obtenir les initiales d'un joueur
  getPlayerInitials(name) {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }
  
  // Obtenir une couleur d'avatar basée sur le nom
  getAvatarColor(name) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
      '#118AB2', '#073B4C', '#EF476F', '#7209B7',
      '#6A994E', '#BC4749', '#EE6C4D', '#3D5A80'
    ];
    
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }
  
  // Obtenir l'élément DOM par ID avec cache
  getElement(id) {
    return this.elements.buttons[id] || 
           this.elements.containers[id] || 
           this.elements.inputs?.[id] || 
           document.getElementById(id);
  }
}

// -------------------------
// INITIALISATION GLOBALE
// -------------------------

// Créer une instance globale
window.RosasUI = new UIManager(window.RosasGameState || new GameState());

// Initialiser quand le DOM est chargé
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.RosasUI.initialize();
    console.log("🎨 UI Manager chargé avec succès");
  });
} else {
  window.RosasUI.initialize();
  console.log("🎨 UI Manager chargé avec succès");
}