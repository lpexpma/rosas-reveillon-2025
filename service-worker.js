// ============================================================
// ROSAS REVEILLON 2025 - SERVICE WORKER
// Version: 2.0.0
// ============================================================

const APP_VERSION = 'v2.0.0';
const CACHE_NAME = `rosas-${APP_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Fichiers à mettre en cache pour le fonctionnement offline
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  
  // CSS
  '/css/style.css',
  '/css/animations.css',
  
  // JavaScript
  '/js/app.js',
  '/js/cards.js',
  '/js/game-state.js',
  '/js/storage-local.js',
  '/js/ui-manager.js',
  '/js/sync-room.js',
  '/js/firebase-init.js',
  
  // Images essentielles
  '/assets/img/Logo.png',
  '/assets/img/icon-192x192.png',
  '/assets/img/icon-512x512.png',
  '/assets/img/favicon.ico',
  
  // Fonts
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Cinzel:wght@400;700&family=Montserrat:wght@300;400;500;600&display=swap'
];

// ============================================================
// INSTALLATION
// ============================================================
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Mise en cache des ressources essentielles');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[Service Worker] Erreur lors de l\'installation:', error);
      })
  );
});

// ============================================================
// ACTIVATION
// ============================================================
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation en cours...');
  
  // Supprimer les anciens caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Suppression de l\'ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      console.log('[Service Worker] Activation terminée');
      return self.clients.claim();
    })
  );
});

// ============================================================
// STRATÉGIE DE CACHE : Cache-First avec réseau comme fallback
// ============================================================
const cacheFirstWithUpdate = async (request) => {
  try {
    // 1. Vérifier si la ressource est dans le cache
    const cachedResponse = await caches.match(request);
    
    // 2. Si trouvé en cache, retourner immédiatement
    if (cachedResponse) {
      // En parallèle, mettre à jour le cache
      fetchAndCache(request);
      return cachedResponse;
    }
    
    // 3. Sinon, aller sur le réseau
    const networkResponse = await fetchAndCache(request);
    return networkResponse;
    
  } catch (error) {
    console.error('[Service Worker] Erreur:', error);
    
    // Fallback pour les pages HTML
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL) || createOfflineResponse();
    }
    
    // Fallback pour les images
    if (request.destination === 'image') {
      return caches.match('/assets/img/Logo.png');
    }
    
    throw error;
  }
};

// ============================================================
// STRATÉGIE DE CACHE : Réseau d'abord avec cache comme fallback
// ============================================================
const networkFirstWithCache = async (request) => {
  try {
    // 1. Essayer d'abord le réseau
    const networkResponse = await fetch(request);
    
    // 2. Mettre à jour le cache
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
    
  } catch (error) {
    console.log('[Service Worker] Réseau indisponible, utilisation du cache');
    
    // 3. Fallback au cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // 4. Fallback générique pour les pages
    if (request.destination === 'document') {
      return caches.match(OFFLINE_URL) || createOfflineResponse();
    }
    
    throw error;
  }
};

// ============================================================
// FONCTION UTILITAIRE : Récupérer et mettre en cache
// ============================================================
const fetchAndCache = async (request) => {
  try {
    const response = await fetch(request);
    
    // Ne pas mettre en cache les réponses d'erreur
    if (!response.ok) {
      return response;
    }
    
    // Vérifier si c'est une ressource qu'on veut mettre en cache
    const shouldCache = 
      response.type === 'basic' && 
      !request.url.includes('sockjs') &&
      !request.url.includes('firestore') &&
      !request.url.includes('analytics');
    
    if (shouldCache) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    
    return response;
    
  } catch (error) {
    console.error('[Service Worker] Erreur fetchAndCache:', error);
    throw error;
  }
};

// ============================================================
// FONCTION UTILITAIRE : Créer une réponse offline
// ============================================================
const createOfflineResponse = () => {
  const offlineHTML = `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Rosas - Hors ligne</title>
      <style>
        body {
          background: #0a0a0a;
          color: #F7B306;
          font-family: 'Montserrat', sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          text-align: center;
        }
        .container {
          padding: 20px;
          max-width: 400px;
        }
        h1 {
          font-family: 'Cinzel', serif;
          font-size: 2rem;
          margin-bottom: 20px;
        }
        p {
          color: #aaa;
          line-height: 1.6;
        }
        .logo {
          font-size: 3rem;
          margin-bottom: 20px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🍷</div>
        <h1>Rosas est hors ligne</h1>
        <p>Veuillez vérifier votre connexion internet et réessayer.</p>
        <p>Ce qui se passe à Rosas reste à Rosas... même hors ligne !</p>
      </div>
    </body>
    </html>
  `;
  
  return new Response(offlineHTML, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache'
    }
  });
};

// ============================================================
// GESTION DES REQUÊTES
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorer les extensions spécifiques
  if (url.pathname.endsWith('.json') && url.pathname.includes('firestore')) {
    return;
  }
  
  // Ignorer les WebSockets
  if (url.protocol === 'ws:' || url.protocol === 'wss:') {
    return;
  }
  
  // Stratégie par type de ressource
  if (request.destination === 'document') {
    // Pour les pages HTML : réseau d'abord
    event.respondWith(networkFirstWithCache(request));
  } else if (request.destination === 'style' || 
             request.destination === 'script' || 
             request.destination === 'font') {
    // Pour CSS, JS, fonts : cache d'abord
    event.respondWith(cacheFirstWithUpdate(request));
  } else if (request.destination === 'image') {
    // Pour les images : cache d'abord si locale, sinon réseau
    if (url.origin === self.location.origin) {
      event.respondWith(cacheFirstWithUpdate(request));
    } else {
      event.respondWith(networkFirstWithCache(request));
    }
  } else {
    // Par défaut : réseau d'abord
    event.respondWith(networkFirstWithCache(request));
  }
});

// ============================================================
// SYNCHRONISATION EN ARRIÈRE-PLAN
// ============================================================
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'sync-game-data') {
    event.waitUntil(syncGameData());
  } else if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos());
  }
});

// ============================================================
// FONCTIONS DE SYNCHRO
// ============================================================
const syncGameData = async () => {
  try {
    // Récupérer les données en attente depuis IndexedDB
    const pendingData = await getPendingData();
    
    for (const data of pendingData) {
      // Synchroniser avec Firebase
      await syncWithFirebase(data);
      // Marquer comme synchronisé
      await markAsSynced(data.id);
    }
    
    console.log('[Service Worker] Données de jeu synchronisées');
  } catch (error) {
    console.error('[Service Worker] Erreur syncGameData:', error);
    throw error; // Pour réessayer
  }
};

const syncPhotos = async () => {
  try {
    const pendingPhotos = await getPendingPhotos();
    
    for (const photo of pendingPhotos) {
      await uploadPhoto(photo);
      await markPhotoAsSynced(photo.id);
    }
    
    console.log('[Service Worker] Photos synchronisées');
  } catch (error) {
    console.error('[Service Worker] Erreur syncPhotos:', error);
    throw error;
  }
};

// ============================================================
// GESTION DES NOTIFICATIONS PUSH
// ============================================================
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nouvelle notification Rosas',
    icon: '/assets/img/icon-192x192.png',
    badge: '/assets/img/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Ouvrir'
      },
      {
        action: 'close',
        title: 'Fermer'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Rosas 2025', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// ============================================================
// FONCTIONS UTILITAIRES (stubs)
// ============================================================
const getPendingData = async () => {
  // À implémenter avec IndexedDB
  return [];
};

const syncWithFirebase = async (data) => {
  // À implémenter avec Firebase
  return Promise.resolve();
};

const markAsSynced = async (id) => {
  // À implémenter avec IndexedDB
  return Promise.resolve();
};

const getPendingPhotos = async () => {
  // À implémenter avec IndexedDB
  return [];
};

const uploadPhoto = async (photo) => {
  // À implémenter avec Firebase Storage
  return Promise.resolve();
};

const markPhotoAsSynced = async (id) => {
  // À implémenter avec IndexedDB
  return Promise.resolve();
};

// ============================================================
// ÉVÉNEMENT MESSAGE (communication avec l'app)
// ============================================================
self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: APP_VERSION });
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => event.ports[0].postMessage({ success: true }))
      .catch(() => event.ports[0].postMessage({ success: false }));
  }
});

// =============================================================
// ÉVÉNEMENT DE MISE À JOUR
// ============================================================
self.addEventListener('updatefound', () => {
  console.log('[Service Worker] Nouvelle version disponible');
  
  // Notifier les clients
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: APP_VERSION
      });
    });
  });
});

console.log('[Service Worker] Chargé et prêt');