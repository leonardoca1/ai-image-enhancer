<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Image Enhancer

Un potente strumento per migliorare e ingrandire le immagini utilizzando l'intelligenza artificiale di Google Gemini.

## Caratteristiche

- 🖼️ **Miglioramento AI**: Migliora automaticamente la qualità delle immagini
- 📏 **Ingrandimento**: Supporta fattori di ingrandimento 2x e 5x
- 🔄 **Confronto**: Visualizza l'immagine originale e quella migliorata affiancate
- 🎨 **Interfaccia moderna**: UI elegante e responsive
- ⚡ **Elaborazione locale**: Tutto funziona sul tuo computer

## Prerequisiti

- **Node.js** (versione 16 o superiore)
- **Chiave API Google Gemini** (gratuita)

## Installazione e Configurazione

### 1. Clona o scarica il progetto

```bash
git clone <repository-url>
cd ai-image-enhancer
```

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Ottieni una chiave API Google Gemini

1. Vai su [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Accedi con il tuo account Google
3. Clicca su "Create API Key"
4. Copia la chiave API generata

### 4. Configura la chiave API

Crea un file `.env.local` nella root del progetto:

```bash
# .env.local
GEMINI_API_KEY=la_tua_chiave_api_qui
```

**⚠️ Importante**: Non condividere mai la tua chiave API! Il file `.env.local` è già incluso nel `.gitignore`.

### 5. Avvia l'applicazione

```bash
npm run dev
```

L'applicazione sarà disponibile su `http://localhost:3000`

## Come Usare

1. **Carica un'immagine**: Clicca su "Scegli File" e seleziona un'immagine
2. **Scegli il fattore di ingrandimento**: Seleziona 2x o 5x
3. **Migliora**: Clicca su "Migliora Immagine" e attendi l'elaborazione
4. **Confronta**: Visualizza l'immagine originale e quella migliorata

## Risoluzione Problemi

### Errore "API_KEY environment variable not set"
- Assicurati di aver creato il file `.env.local`
- Verifica che la chiave API sia corretta
- Riavvia l'applicazione dopo aver modificato il file `.env.local`

### Errore di connessione all'API
- Controlla la tua connessione internet
- Verifica che la chiave API sia valida e non scaduta
- Controlla i limiti di utilizzo della tua chiave API

### L'immagine non si carica
- Verifica che il file sia in un formato supportato (JPG, PNG, WebP)
- Controlla che la dimensione del file non superi i limiti dell'API

## Tecnologie Utilizzate

- **React 19** - Framework UI
- **TypeScript** - Linguaggio di programmazione
- **Vite** - Build tool e dev server
- **Google Gemini API** - AI per il miglioramento delle immagini
- **Tailwind CSS** - Styling

## Script Disponibili

- `npm run dev` - Avvia il server di sviluppo
- `npm run build` - Crea la build di produzione
- `npm run preview` - Anteprima della build di produzione

## Licenza

Questo progetto è open source e disponibile sotto licenza MIT.
