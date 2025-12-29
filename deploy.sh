#!/bin/bash

# Déploiement automatique Rosas 2025

echo "🚀 Déploiement Rosas Réveillon 2025..."

# Vérifier les dépendances
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé"
    echo "Installation : npm i -g vercel"
    exit 1
fi

# Variables
PROJECT_NAME="rosas-2025"
GIT_REPO="https://github.com/$(git config --get remote.origin.url | cut -d: -f2 | cut -d. -f1)"

echo "📦 Préparation du déploiement..."

# Minifier les fichiers (optionnel)
echo "⚡ Minification des fichiers..."
if command -v uglifyjs &> /dev/null; then
    uglifyjs js/app.js -o js/app.min.js -c -m
    mv js/app.min.js js/app.js
fi

if command -v cleancss &> /dev/null; then
    cleancss -o css/style.min.css css/style.css
    mv css/style.min.css css/style.css
fi

# Vérifier la taille des assets
echo "📊 Vérification des assets..."
du -sh css/ js/ assets/ 2>/dev/null || true

# Déployer
echo "🚀 Déploiement sur Vercel..."
vercel --prod --confirm

# Vérifier le déploiement
if [ $? -eq 0 ]; then
    echo "✅ Déploiement réussi!"
    echo "🌐 URL: https://$PROJECT_NAME.vercel.app"
else
    echo "❌ Échec du déploiement"
    exit 1
fi