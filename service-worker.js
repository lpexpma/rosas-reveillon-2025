// ============================================================
// ROSAS — MODE SALON (CHROMECAST) — SERVICE WORKER
// Version: 2.0.0-salon
// ============================================================

const APP_VERSION = "2.0.0-salon";
const CACHE_NAME = `rosas-salon-v${APP_VERSION}`;

// Page offline (générée à la volée)
const OFFLINE_FALLBACK_HTML = `
<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Rosas — Hors ligne</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #000000;
      color: #F7B306;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      padding: 40px 30px;
      border: 1px solid #F7B306;
      border-radius: 12px;
      background: rgba(10, 10, 10, 0.9);
    }
    .emoji {
      font-size: 48px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 28px;
      letter-spacing: 2px;
      margin-bottom: 15px;
      font-weight: 300;
    }
    p {
      color: #888888;
      line-height: 1.5;
      margin: 10px 0;
    }
    .reload-btn {
      margin-top: 25px;
      padding: 12px 24px;
      background: #F7B306;
      color: #000000;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="emoji">🍷</div>
    <h1>ROSAS est hors ligne</h1>
    <p>Vérifiez votre connexion Internet, puis rechargez la page.</p>
    <p>Les fonctionnalités essentielles restent accessibles.</p>
    <button class="reload-btn" onclick="window.location.reload()">Recharger</button>
  </div>
</body>
</html>`;

// Fichiers à mettre en cache (absolument nécessaires)
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  
  // CSS
  "/css/style.css",
  
  // JavaScript
  "/js/cards.js",
  "/js/salon.js",
  
  // Images essentielles
  "/assets/img/favicon.ico",
  "/assets/img/icon-192x192.png",
  "/assets/img/icon-512x512.png"
];

// ============================================================
// INSTALLATION
// ============================================================
self.addEventListener("install", (event) => {
  console.log("[SW] Installation de ROSAS Salon v" + APP_VERSION);
  
  event.waitUntil((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      
      // Ajouter les ressources essentielles une par une
      const cachePromises = PRECACHE_ASSETS.map(async (url) => {
        try {
          // Vérifier si la ressource existe avant de la mettre en cache
          const response = await fetch(url, { mode: 'no-cors' });
          if (response && (response.ok || response.type === 'opaque')) {
            await cache.put(url, response);
            console.log("[SW] Pré-cache réussi:", url);
          }
        } catch (err) {
          console.warn("[SW] Échec pré-cache pour", url, "- ignoré:", err.message);
        }
      });
      
      await Promise.all(cachePromises);
      console.log("[SW] Pré-cache terminé");
      
      // Activer immédiatement le nouveau service worker
      await self.skipWaiting();
      
    } catch (err) {
      console.error("[SW] Erreur lors de l'installation:", err);
    }
  })());
});

// ============================================================
// ACTIVATION
// ============================================================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation de ROSAS Salon v" + APP_VERSION);
  
  event.waitUntil((async () => {
    // Nettoyer les anciens caches
    const cacheKeys = await caches.keys();
    const deletePromises = cacheKeys.map(key => {
      if (key !== CACHE_NAME) {
        console.log("[SW] Suppression ancien cache:", key);
        return caches.delete(key);
      }
    });
    
    await Promise.all(deletePromises);
    console.log("[SW] Nettoyage des caches terminé");
    
    // Prendre le contrôle de toutes les pages
    await self.clients.claim();
    console.log("[SW] Prêt à fonctionner");
  })());
});

// ============================================================
// STRATÉGIES DE RÉCUPÉRATION
// ============================================================

// Stratégie "Cache d'abord" pour les assets statiques
async function cacheFirst(request) {
  try {
    // Vérifier le cache d'abord
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Sinon, aller sur le réseau
    const networkResponse = await fetch(request);
    
    // Mettre en cache si la réponse est valide
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback pour les images
    if (request.destination === "image") {
      const fallbacks = [
        "/assets/img/icon-512x512.png",
        "/assets/img/icon-192x192.png",
        "/assets/img/favicon.ico"
      ];
      
      for (const fallback of fallbacks) {
        const fallbackResponse = await caches.match(fallback);
        if (fallbackResponse) return fallbackResponse;
      }
    }
    
    throw error;
  }
}

// Stratégie "Réseau d'abord, sinon cache" pour les pages HTML
async function networkFirst(request) {
  try {
    // Essayer le réseau d'abord
    const networkResponse = await fetch(request);
    
    // Mettre à jour le cache
    if (networkResponse && networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // En cas d'échec, chercher dans le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Si c'est une page HTML, retourner la page offline
    if (request.headers.get("Accept")?.includes("text/html") || 
        request.destination === "document") {
      return new Response(OFFLINE_FALLBACK_HTML, {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store"
        }
      });
    }
    
    throw error;
  }
}

// Stratégie "Cache seulement" pour les resources critiques
async function cacheOnly(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Fallback pour les scripts et styles
  if (request.destination === "script" || request.destination === "style") {
    return new Response("", {
      status: 404,
      statusText: "Not Found in Cache"
    });
  }
  
  throw new Error("Resource not cached");
}

// ============================================================
// GESTION DES REQUÊTES FETCH
// ============================================================
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les protocoles spéciaux
  if (request.method !== "GET") return;
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  
  // Stratégies par type de ressource
  switch (request.destination) {
    case "document": // Pages HTML
      event.respondWith(networkFirst(request));
      break;
      
    case "style":     // CSS
    case "script":    // JavaScript
    case "font":      // Polices
      event.respondWith(cacheFirst(request));
      break;
      
    case "image":     // Images
      // Pour les images du projet ROSAS
      if (url.pathname.includes("/assets/img/")) {
        event.respondWith(cacheFirst(request));
      } else {
        // Pour les images externes, réseau d'abord
        event.respondWith(networkFirst(request));
      }
      break;
      
    default:
      // Par défaut, réseau d'abord
      event.respondWith(networkFirst(request));
  }
});

// ============================================================
// COMMUNICATION AVEC L'APPLICATION
// ============================================================
self.addEventListener("message", (event) => {
  const { data, ports } = event;
  
  switch (data?.type) {
    case "SKIP_WAITING":
      self.skipWaiting();
      if (ports?.[0]) {
        ports[0].postMessage({ success: true });
      }
      break;
      
    case "GET_VERSION":
      if (ports?.[0]) {
        ports[0].postMessage({ 
          version: APP_VERSION,
          cacheName: CACHE_NAME
        });
      }
      break;
      
    case "GET_CACHE_INFO":
      (async () => {
        try {
          const cache = await caches.open(CACHE_NAME);
          const keys = await cache.keys();
          const cachedUrls = keys.map(req => req.url);
          
          if (ports?.[0]) {
            ports[0].postMessage({
              cacheName: CACHE_NAME,
              cacheSize: cachedUrls.length,
              cachedUrls: cachedUrls
            });
          }
        } catch (error) {
          if (ports?.[0]) {
            ports[0].postMessage({ error: error.message });
          }
        }
      })();
      break;
      
    case "CLEAR_CACHE":
      (async () => {
        try {
          await caches.delete(CACHE_NAME);
          console.log("[SW] Cache vidé à la demande");
          
          if (ports?.[0]) {
            ports[0].postMessage({ success: true });
          }
        } catch (error) {
          if (ports?.[0]) {
            ports[0].postMessage({ error: error.message });
          }
        }
      })();
      break;
      
    case "UPDATE_CACHE":
      // Mettre à jour des ressources spécifiques
      (async () => {
        try {
          const { urls = [] } = data;
          const cache = await caches.open(CACHE_NAME);
          
          const updatePromises = urls.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
                console.log("[SW] Ressource mise à jour:", url);
              }
            } catch (err) {
              console.warn("[SW] Échec mise à jour:", url, err.message);
            }
          });
          
          await Promise.all(updatePromises);
          
          if (ports?.[0]) {
            ports[0].postMessage({ 
              success: true,
              updatedCount: urls.length
            });
          }
        } catch (error) {
          if (ports?.[0]) {
            ports[0].postMessage({ error: error.message });
          }
        }
      })();
      break;
  }
});

// ============================================================
// GESTION DES PUSH NOTIFICATIONS (optionnel pour futur)
// ============================================================
self.addEventListener("push", (event) => {
  // Pour l'instant, pas de notifications push
  // Peut être implémenté plus tard
  console.log("[SW] Push reçu", event.data?.text());
});

// ============================================================
// GESTION DES BACKGROUND SYNC (optionnel pour futur)
// ============================================================
self.addEventListener("sync", (event) => {
  console.log("[SW] Sync event:", event.tag);
});

console.log("[SW] Service Worker ROSAS Salon chargé - Version:", APP_VERSION);