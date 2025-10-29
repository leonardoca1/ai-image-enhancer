#!/bin/bash

# Script per creare un'app macOS che avvia AI Image Enhancer
APP_NAME="AI Image Enhancer"
APP_DIR="/Applications/$APP_NAME.app"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Crea la struttura dell'app
mkdir -p "$APP_DIR/Contents/MacOS"
mkdir -p "$APP_DIR/Contents/Resources"

# Crea il file Info.plist
cat > "$APP_DIR/Contents/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>launcher</string>
    <key>CFBundleIdentifier</key>
    <string>com.aienhancer.app</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundleVersion</key>
    <string>1.0.0</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0.0</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleSignature</key>
    <string>????</string>
    <key>LSMinimumSystemVersion</key>
    <string>10.15</string>
    <key>NSHighResolutionCapable</key>
    <true/>
</dict>
</plist>
EOF

# Crea lo script launcher
cat > "$APP_DIR/Contents/MacOS/launcher" << 'EOF'
#!/bin/bash

# Directory del progetto
PROJECT_DIR="/Users/leonardocamettiaspri/Downloads/ai-image-enhancer"

# Vai alla directory del progetto
cd "$PROJECT_DIR"

# Controlla se Node.js è installato
if ! command -v node &> /dev/null; then
    osascript -e 'display alert "Node.js non trovato" message "Node.js non è installato. Installa Node.js per usare questa app." buttons {"OK"} default button "OK"'
    exit 1
fi

# Controlla se npm è installato
if ! command -v npm &> /dev/null; then
    osascript -e 'display alert "npm non trovato" message "npm non è installato. Installa Node.js per usare questa app." buttons {"OK"} default button "OK"'
    exit 1
fi

# Controlla se il file .env.local esiste
if [ ! -f ".env.local" ]; then
    osascript -e 'display alert "Configurazione mancante" message "File .env.local non trovato. Configura la tua API key di Google Gemini." buttons {"OK"} default button "OK"'
    exit 1
fi

# Avvia il server in background
npm run dev &
SERVER_PID=$!

# Aspetta che il server si avvii
sleep 3

# Apri il browser
open "http://localhost:3000"

# Mostra notifica
osascript -e 'display notification "AI Image Enhancer avviato!" with title "AI Image Enhancer"'

# Mantieni lo script in esecuzione per tenere il server attivo
wait $SERVER_PID
EOF

# Rendi eseguibile lo script
chmod +x "$APP_DIR/Contents/MacOS/launcher"

# Copia l'icona se esiste
if [ -f "$SCRIPT_DIR/assets/icon.png" ]; then
    cp "$SCRIPT_DIR/assets/icon.png" "$APP_DIR/Contents/Resources/icon.png"
fi

echo "✅ App creata con successo!"
echo "📱 Trova 'AI Image Enhancer' in Applications"
echo "🚀 Fai doppio clic per avviare l'app!"




