# setup-firebase.ps1
Write-Host "🔥 Configuration Firebase pour Rosas 2025" -ForegroundColor Red

# Installation des dépendances
Write-Host "Installation des dépendances..." -ForegroundColor Yellow
npm install firebase

# Demander les informations Firebase
Write-Host "`nEntrez vos informations Firebase :" -ForegroundColor Cyan

$apiKey = Read-Host "API Key"
$authDomain = Read-Host "Auth Domain"
$projectId = Read-Host "Project ID"
$storageBucket = Read-Host "Storage Bucket"
$messagingSenderId = Read-Host "Messaging Sender ID"
$appId = Read-Host "App ID"

# Créer le fichier de config
$firebaseConfig = @"
const firebaseConfig = {
  apiKey: "$apiKey",
  authDomain: "$authDomain",
  projectId: "$projectId",
  storageBucket: "$storageBucket",
  messagingSenderId: "$messagingSenderId",
  appId: "$appId"
};
"@

# Sauvegarder dans un fichier JS
$firebaseConfig | Out-File -FilePath "firebase-config.js" -Encoding UTF8

Write-Host "`n✅ Configuration Firebase créée !" -ForegroundColor Green
Write-Host "📁 Fichier : firebase-config.js" -ForegroundColor Cyan

# Instructions pour déploiement
Write-Host "`n📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "1. Ajoutez firebase-config.js à .gitignore" -ForegroundColor White
Write-Host "2. Déployez les règles Firestore : firebase deploy --only firestore:rules" -ForegroundColor White
Write-Host "3. Mettez à jour votre index.html avec le SDK Firebase" -ForegroundColor White