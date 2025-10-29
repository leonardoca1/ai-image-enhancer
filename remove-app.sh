#!/bin/bash

# Script per rimuovere l'app AI Image Enhancer da Applications
APP_NAME="AI Image Enhancer"
APP_DIR="/Applications/$APP_NAME.app"

echo "🗑️  Rimuovendo $APP_NAME da Applications..."

if [ -d "$APP_DIR" ]; then
    rm -rf "$APP_DIR"
    echo "✅ App rimossa con successo!"
else
    echo "ℹ️  App non trovata in Applications"
fi

echo "🎉 Pulizia completata!"




