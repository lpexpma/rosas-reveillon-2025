// js/storage-local.js
// Gestion du stockage local pour Rosas (sans les photos)

// -------------------------
// CLASSE STORAGE LOCAL
// -------------------------
class StorageLocal {
  constructor() {
    this.prefix = 'rosas_';
    this.enabled = this.checkLocalStorage();
    
    // Clés de stockage
    this.keys = {
      USER_SETTINGS: 'user_settings',
      GAME_STATE: 'game_state',
      PLAYERS_DATA: 'players_data',
      CARDS_STATS: 'cards_stats',
      RULES_HISTORY: 'rules_history',
      PARTY_HISTORY: 'party_history',
      USER_STATS: 'user_stats',
      THEME_PREFERENCES: 'theme_prefs',
      GAME_CONFIG: 'game_config',
      LAST_SESSION: 'last_session'
    };
    
    console.log("💾 StorageLocal initialisé");
  }
  
  // -------------------------
  // VÉRIFICATION ET CONFIGURATION
  // -------------------------
  
  // Vérifier si localStorage est disponible
  checkLocalStorage() {
    try {
      const testKey = '__test__';
      localStorage.setItem(testKey, testKey);
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      console.warn('⚠️ localStorage non disponible:', error.message);
      return false;
    }
  }
  
  // Obtenir une clé complète avec préfixe
  getKey(key) {
    return `${this.prefix}${key}`;
  }
  
  // -------------------------
  // GESTION DES PARAMÈTRES UTILISATEUR
  // -------------------------
  
  // Sauvegarder les paramètres utilisateur
  saveUserSettings(settings) {
    if (!this.enabled) return false;
    
    const data = {
      pseudo: settings.pseudo || '',
      gender: settings.gender || 'unknown',
      avatar: settings.avatar || null,
      preferences: {
        soundEnabled: settings.soundEnabled !== false,
        notifications: settings.notifications !== false,
        darkMode: settings.darkMode || false,
        vibration: settings.vibration || true
      },
      lastLogin: Date.now(),
      loginCount: (this.loadUserSettings()?.loginCount || 0) + 1
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.USER_SETTINGS), JSON.stringify(data));
      console.log('💾 Paramètres utilisateur sauvegardés');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde paramètres:', error);
      return false;
    }
  }
  
  // Charger les paramètres utilisateur
  loadUserSettings() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.USER_SETTINGS));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement paramètres:', error);
      return null;
    }
  }
  
  // Sauvegarder uniquement le pseudo
  saveUserPseudo(pseudo) {
    if (!this.enabled) return false;
    
    const settings = this.loadUserSettings() || {};
    settings.pseudo = pseudo;
    settings.lastUpdated = Date.now();
    
    return this.saveUserSettings(settings);
  }
  
  // -------------------------
  // GESTION DE L'ÉTAT DU JEU
  // -------------------------
  
  // Sauvegarder l'état du jeu (sans photos)
  saveGameState(gameState) {
    if (!this.enabled) return false;
    
    // Filtrer les photos de l'état du jeu
    const stateToSave = {
      ...gameState,
      photos: [] // Ne pas sauvegarder les photos
    };
    
    try {
      const compressed = this.compressGameState(stateToSave);
      localStorage.setItem(this.getKey(this.keys.GAME_STATE), compressed);
      console.log('🎮 État du jeu sauvegardé');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde état jeu:', error);
      return false;
    }
  }
  
  // Charger l'état du jeu
  loadGameState() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.GAME_STATE));
      return data ? this.decompressGameState(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement état jeu:', error);
      return null;
    }
  }
  
  // Effacer l'état du jeu
  clearGameState() {
    if (!this.enabled) return false;
    
    try {
      localStorage.removeItem(this.getKey(this.keys.GAME_STATE));
      console.log('🗑️ État du jeu effacé');
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement état jeu:', error);
      return false;
    }
  }
  
  // -------------------------
  // GESTION DES DONNÉES DES JOUEURS
  // -------------------------
  
  // Sauvegarder les données des joueurs
  savePlayersData(players) {
    if (!this.enabled) return false;
    
    const data = {
      players: players.map(player => ({
        id: player.id,
        name: player.name,
        gender: player.gender,
        sips: player.sips || 0,
        isHost: player.isHost || false,
        joinedAt: player.joinedAt,
        turnsPlayed: player.turnsPlayed || 0,
        cardsDrawn: player.cardsDrawn || 0
      })),
      savedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.PLAYERS_DATA), JSON.stringify(data));
      console.log(`👥 Données de ${players.length} joueurs sauvegardées`);
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde joueurs:', error);
      return false;
    }
  }
  
  // Charger les données des joueurs
  loadPlayersData() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.PLAYERS_DATA));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement joueurs:', error);
      return null;
    }
  }
  
  // -------------------------
  // GESTION DES STATISTIQUES DES CARTES
  // -------------------------
  
  // Sauvegarder les statistiques des cartes
  saveCardsStats(stats) {
    if (!this.enabled) return false;
    
    const data = {
      ...stats,
      updatedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.CARDS_STATS), JSON.stringify(data));
      console.log('📊 Statistiques cartes sauvegardées');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde stats cartes:', error);
      return false;
    }
  }
  
  // Charger les statistiques des cartes
  loadCardsStats() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.CARDS_STATS));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement stats cartes:', error);
      return null;
    }
  }
  
  // Mettre à jour les statistiques d'une carte
  updateCardStat(cardId, theme, action = 'drawn') {
    if (!this.enabled) return false;
    
    const stats = this.loadCardsStats() || {
      totalCards: 286,
      usedCards: 0,
      remainingCards: 286,
      byTheme: {},
      byCard: {},
      mostUsedCards: [],
      lastUpdated: Date.now()
    };
    
    // Initialiser le thème si nécessaire
    if (!stats.byTheme[theme]) {
      stats.byTheme[theme] = {
        total: window.CARDS_DATABASE[theme]?.length || 0,
        used: 0,
        remaining: window.CARDS_DATABASE[theme]?.length || 0,
        progress: 0
      };
    }
    
    // Mettre à jour les statistiques globales
    if (action === 'drawn') {
      stats.usedCards = (stats.usedCards || 0) + 1;
      stats.remainingCards = Math.max(0, stats.totalCards - stats.usedCards);
      stats.progress = Math.round((stats.usedCards / stats.totalCards) * 100);
      
      // Mettre à jour les statistiques par thème
      if (stats.byTheme[theme]) {
        stats.byTheme[theme].used = (stats.byTheme[theme].used || 0) + 1;
        stats.byTheme[theme].remaining = Math.max(0, stats.byTheme[theme].total - stats.byTheme[theme].used);
        stats.byTheme[theme].progress = Math.round((stats.byTheme[theme].used / stats.byTheme[theme].total) * 100);
      }
      
      // Mettre à jour les statistiques par carte
      if (!stats.byCard[cardId]) {
        stats.byCard[cardId] = {
          id: cardId,
          theme: theme,
          timesUsed: 0,
          lastUsed: null
        };
      }
      
      stats.byCard[cardId].timesUsed = (stats.byCard[cardId].timesUsed || 0) + 1;
      stats.byCard[cardId].lastUsed = Date.now();
      
      // Mettre à jour la liste des cartes les plus utilisées
      const cardEntry = { id: cardId, theme: theme, timesUsed: stats.byCard[cardId].timesUsed };
      const existingIndex = stats.mostUsedCards?.findIndex(c => c.id === cardId) || -1;
      
      if (existingIndex >= 0) {
        stats.mostUsedCards[existingIndex] = cardEntry;
      } else {
        stats.mostUsedCards = [...(stats.mostUsedCards || []), cardEntry];
      }
      
      // Trier par utilisation décroissante
      stats.mostUsedCards.sort((a, b) => b.timesUsed - a.timesUsed);
      stats.mostUsedCards = stats.mostUsedCards.slice(0, 10); // Garder les 10 premières
    }
    
    stats.lastUpdated = Date.now();
    
    return this.saveCardsStats(stats);
  }
  
  // -------------------------
  // HISTORIQUE DES RÈGLES
  // -------------------------
  
  // Ajouter une règle à l'historique
  addRuleToHistory(rule, playerName, duration = 0) {
    if (!this.enabled) return false;
    
    const history = this.loadRulesHistory() || [];
    
    const ruleEntry = {
      rule: rule,
      player: playerName,
      timestamp: Date.now(),
      duration: duration,
      active: duration > 0
    };
    
    history.unshift(ruleEntry); // Ajouter au début
    
    // Garder seulement les 50 dernières règles
    if (history.length > 50) {
      history.pop();
    }
    
    try {
      localStorage.setItem(this.getKey(this.keys.RULES_HISTORY), JSON.stringify(history));
      console.log('📜 Règle ajoutée à l\'historique');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde historique règles:', error);
      return false;
    }
  }
  
  // Charger l'historique des règles
  loadRulesHistory() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.RULES_HISTORY));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement historique règles:', error);
      return null;
    }
  }
  
  // Marquer une règle comme expirée
  markRuleAsExpired(rule) {
    if (!this.enabled) return false;
    
    const history = this.loadRulesHistory() || [];
    
    const ruleIndex = history.findIndex(r => 
      r.rule === rule && r.active === true
    );
    
    if (ruleIndex >= 0) {
      history[ruleIndex].active = false;
      history[ruleIndex].expiredAt = Date.now();
      
      try {
        localStorage.setItem(this.getKey(this.keys.RULES_HISTORY), JSON.stringify(history));
        console.log('📜 Règle marquée comme expirée');
        return true;
      } catch (error) {
        console.error('❌ Erreur mise à jour règle:', error);
        return false;
      }
    }
    
    return false;
  }
  
  // -------------------------
  // HISTORIQUE DES PARTIES
  // -------------------------
  
  // Ajouter une partie à l'historique
  addPartyToHistory(partyData) {
    if (!this.enabled) return false;
    
    const history = this.loadPartyHistory() || [];
    
    const partyEntry = {
      id: `party_${Date.now()}`,
      code: partyData.code || 'N/A',
      players: partyData.players || [],
      winner: partyData.winner || null,
      totalTurns: partyData.totalTurns || 0,
      duration: partyData.duration || 0,
      startedAt: partyData.startTime || Date.now(),
      finishedAt: Date.now(),
      sipsTotal: partyData.players?.reduce((sum, p) => sum + (p.sips || 0), 0) || 0
    };
    
    history.unshift(partyEntry);
    
    // Garder seulement les 20 dernières parties
    if (history.length > 20) {
      history.pop();
    }
    
    try {
      localStorage.setItem(this.getKey(this.keys.PARTY_HISTORY), JSON.stringify(history));
      console.log('🏁 Partie ajoutée à l\'historique');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde historique parties:', error);
      return false;
    }
  }
  
  // Charger l'historique des parties
  loadPartyHistory() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.PARTY_HISTORY));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement historique parties:', error);
      return null;
    }
  }
  
  // Obtenir les statistiques de toutes les parties
  getPartiesStats() {
    const history = this.loadPartyHistory() || [];
    
    const stats = {
      totalParties: history.length,
      totalPlayers: history.reduce((sum, party) => sum + (party.players?.length || 0), 0),
      totalTurns: history.reduce((sum, party) => sum + (party.totalTurns || 0), 0),
      totalSips: history.reduce((sum, party) => sum + (party.sipsTotal || 0), 0),
      averagePlayers: history.length > 0 ? 
        Math.round(history.reduce((sum, party) => sum + (party.players?.length || 0), 0) / history.length) : 0,
      averageDuration: history.length > 0 ?
        Math.round(history.reduce((sum, party) => sum + (party.duration || 0), 0) / history.length) : 0,
      mostWins: this.getMostWins(history),
      lastParty: history.length > 0 ? history[0] : null
    };
    
    return stats;
  }
  
  // Obtenir les joueurs avec le plus de victoires
  getMostWins(history) {
    const wins = {};
    
    history.forEach(party => {
      if (party.winner) {
        wins[party.winner.name] = (wins[party.winner.name] || 0) + 1;
      }
    });
    
    return Object.entries(wins)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }
  
  // -------------------------
  // STATISTIQUES UTILISATEUR
  // -------------------------
  
  // Sauvegarder les statistiques utilisateur
  saveUserStats(stats) {
    if (!this.enabled) return false;
    
    const data = {
      ...stats,
      updatedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.USER_STATS), JSON.stringify(data));
      console.log('📈 Statistiques utilisateur sauvegardées');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde stats utilisateur:', error);
      return false;
    }
  }
  
  // Charger les statistiques utilisateur
  loadUserStats() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.USER_STATS));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement stats utilisateur:', error);
      return null;
    }
  }
  
  // Mettre à jour les statistiques utilisateur
  updateUserStat(statName, value = 1) {
    if (!this.enabled) return false;
    
    const stats = this.loadUserStats() || {
      gamesPlayed: 0,
      gamesHosted: 0,
      totalTurns: 0,
      cardsDrawn: 0,
      sipsTaken: 0,
      sipsGiven: 0,
      wins: 0,
      partiesCreated: 0,
      lastUpdated: Date.now()
    };
    
    // Mettre à jour la statistique
    if (statName in stats) {
      stats[statName] = (stats[statName] || 0) + value;
    } else {
      stats[statName] = value;
    }
    
    stats.lastUpdated = Date.now();
    
    return this.saveUserStats(stats);
  }
  
  // -------------------------
  // PRÉFÉRENCES DE THÈMES
  // -------------------------
  
  // Sauvegarder les préférences de thèmes
  saveThemePreferences(prefs) {
    if (!this.enabled) return false;
    
    const data = {
      ...prefs,
      savedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.THEME_PREFERENCES), JSON.stringify(data));
      console.log('🎨 Préférences de thèmes sauvegardées');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde préférences thèmes:', error);
      return false;
    }
  }
  
  // Charger les préférences de thèmes
  loadThemePreferences() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.THEME_PREFERENCES));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement préférences thèmes:', error);
      return null;
    }
  }
  
  // Mettre à jour le compteur d'utilisation d'un thème
  updateThemeUsage(theme) {
    if (!this.enabled) return false;
    
    const prefs = this.loadThemePreferences() || {
      themeUsage: {},
      favoriteTheme: null,
      lastUpdated: Date.now()
    };
    
    // Initialiser le thème si nécessaire
    if (!prefs.themeUsage[theme]) {
      prefs.themeUsage[theme] = {
        count: 0,
        lastUsed: null
      };
    }
    
    // Mettre à jour les statistiques
    prefs.themeUsage[theme].count += 1;
    prefs.themeUsage[theme].lastUsed = Date.now();
    
    // Trouver le thème favori
    let favorite = null;
    let maxCount = 0;
    
    Object.entries(prefs.themeUsage).forEach(([themeName, stats]) => {
      if (stats.count > maxCount) {
        maxCount = stats.count;
        favorite = themeName;
      }
    });
    
    prefs.favoriteTheme = favorite;
    prefs.lastUpdated = Date.now();
    
    return this.saveThemePreferences(prefs);
  }
  
  // -------------------------
  // CONFIGURATION DU JEU
  // -------------------------
  
  // Sauvegarder la configuration du jeu
  saveGameConfig(config) {
    if (!this.enabled) return false;
    
    const data = {
      ...config,
      savedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.GAME_CONFIG), JSON.stringify(data));
      console.log('⚙️ Configuration du jeu sauvegardée');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde configuration:', error);
      return false;
    }
  }
  
  // Charger la configuration du jeu
  loadGameConfig() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.GAME_CONFIG));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement configuration:', error);
      return null;
    }
  }
  
  // -------------------------
  // SESSION COURANTE
  // -------------------------
  
  // Sauvegarder la session courante
  saveLastSession(sessionData) {
    if (!this.enabled) return false;
    
    const data = {
      ...sessionData,
      savedAt: Date.now()
    };
    
    try {
      localStorage.setItem(this.getKey(this.keys.LAST_SESSION), JSON.stringify(data));
      console.log('💫 Session sauvegardée');
      return true;
    } catch (error) {
      console.error('❌ Erreur sauvegarde session:', error);
      return false;
    }
  }
  
  // Charger la dernière session
  loadLastSession() {
    if (!this.enabled) return null;
    
    try {
      const data = localStorage.getItem(this.getKey(this.keys.LAST_SESSION));
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('❌ Erreur chargement session:', error);
      return null;
    }
  }
  
  // -------------------------
  // COMPRESSION/DÉCOMPRESSION
  // -------------------------
  
  // Compresser l'état du jeu (simple)
  compressGameState(state) {
    try {
      // Version simple - juste JSON
      return JSON.stringify(state);
    } catch (error) {
      console.error('❌ Erreur compression:', error);
      return JSON.stringify({});
    }
  }
  
  // Décompresser l'état du jeu
  decompressGameState(data) {
    try {
      return JSON.parse(data);
    } catch (error) {
      console.error('❌ Erreur décompression:', error);
      return null;
    }
  }
  
  // -------------------------
  // UTILITAIRES
  // -------------------------
  
  // Effacer toutes les données (sauf paramètres utilisateur)
  clearAllGameData() {
    if (!this.enabled) return false;
    
    try {
      // Liste des clés à conserver
      const keepKeys = [this.keys.USER_SETTINGS, this.keys.USER_STATS];
      
      // Effacer toutes les autres clés
      Object.values(this.keys).forEach(key => {
        if (!keepKeys.includes(key)) {
          localStorage.removeItem(this.getKey(key));
        }
      });
      
      console.log('🗑️ Toutes les données de jeu effacées');
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement données:', error);
      return false;
    }
  }
  
  // Effacer complètement toutes les données
  clearAllData() {
    if (!this.enabled) return false;
    
    try {
      // Effacer toutes les clés avec le préfixe
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      }
      
      console.log('🔥 Toutes les données Rosas effacées');
      return true;
    } catch (error) {
      console.error('❌ Erreur effacement complet:', error);
      return false;
    }
  }
  
  // Obtenir l'utilisation du stockage
  getStorageUsage() {
    if (!this.enabled) return null;
    
    let totalSize = 0;
    let items = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        const value = localStorage.getItem(key);
        const size = (key.length + value.length) * 2; // Estimation en octets
        totalSize += size;
        
        items.push({
          key: key.replace(this.prefix, ''),
          size: size,
          sizeKB: (size / 1024).toFixed(2)
        });
      }
    }
    
    return {
      totalSize: totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
      itemCount: items.length,
      items: items.sort((a, b) => b.size - a.size)
    };
  }
  
  // Sauvegarder une backup des données
  exportBackup() {
    if (!this.enabled) return null;
    
    const backup = {
      version: '1.0',
      timestamp: Date.now(),
      data: {}
    };
    
    // Collecter toutes les données
    Object.values(this.keys).forEach(key => {
      const value = localStorage.getItem(this.getKey(key));
      if (value) {
        backup.data[key] = JSON.parse(value);
      }
    });
    
    return JSON.stringify(backup, null, 2);
  }
  
  // Restaurer depuis une backup
  importBackup(backupJson) {
    if (!this.enabled) return false;
    
    try {
      const backup = JSON.parse(backupJson);
      
      // Sauvegarder les données actuelles
      const currentBackup = this.exportBackup();
      
      // Restaurer les données
      Object.entries(backup.data).forEach(([key, value]) => {
        localStorage.setItem(this.getKey(key), JSON.stringify(value));
      });
      
      console.log('🔄 Backup restaurée');
      return {
        success: true,
        backup: currentBackup
      };
    } catch (error) {
      console.error('❌ Erreur restauration backup:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// -------------------------
// INSTANCE GLOBALE
// -------------------------

// Créer une instance globale
window.RosasStorage = new StorageLocal();

// Initialiser au chargement
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('💾 StorageLocal prêt');
  });
} else {
  console.log('💾 StorageLocal prêt');
}

// Exporter pour le débogage
if (typeof window !== 'undefined') {
  window.debugStorage = {
    clearAll: () => window.RosasStorage.clearAllData(),
    getUsage: () => window.RosasStorage.getStorageUsage(),
    exportBackup: () => window.RosasStorage.exportBackup(),
    importBackup: (data) => window.RosasStorage.importBackup(data)
  };
}

console.log('✅ storage-local.js chargé avec succès');