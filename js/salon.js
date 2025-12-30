// app.js — ROSAS Mode Salon
// Remarque : Ce fichier est obsolète. La logique principale est dans salon.js
// Ce fichier est gardé pour compatibilité si nécessaire

console.log('ROSAS Mode Salon - app.js chargé (version compatibilité)');

// Vérifier si salon.js est déjà chargé
if (typeof window.initRosasGame !== 'function') {
  console.warn('salon.js n\'est pas encore chargé. La logique principale sera gérée par salon.js');
  
  // Fonction de secours pour éviter les erreurs
  window.startGameFallback = function() {
    console.log('Utilisation de la logique intégrée dans index.html');
    return true;
  };
  
  window.nextPlayerFallback = function() {
    console.log('Utilisation de la logique intégrée dans index.html');
    return true;
  };
}

// État global pour compatibilité
window.ROSAS_APP = window.ROSAS_APP || {
  version: '2.0',
  mode: 'salon',
  initialized: false
};

// Initialisation de compatibilité
document.addEventListener('DOMContentLoaded', function() {
  console.log('ROSAS Mode Salon - Compatibilité initialisée');
  window.ROSAS_APP.initialized = true;
});

// Exporter pour compatibilité
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.ROSAS_APP;
}