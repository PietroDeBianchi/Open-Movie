# 🎬 MovieChat AI

MovieChat AI è un'applicazione che utilizza le API di OpenAI per cercare film in base a un prompt testuale, sfruttando un database di film `Full TMDB Movies Dataset 2024 (1M Movies)` su Kaggle.

## ✅ Prerequisiti

Assicurati di avere i seguenti strumenti installati:

- [Node.js](https://nodejs.org/) (versione consigliata: 18.x o superiore)
- [MongoDB](https://www.mongodb.com/try/download/community) (per il database locale dei film)
- [API Key di OpenAI](https://platform.openai.com/account/api-keys) (richiesta per l'integrazione con le API di OpenAI)

## 📚 Dataset

Il progetto utilizza il [dataset di film da TMDb](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies), che deve essere scaricato e caricato in MongoDB.

## 🛠️ Configurazione del progetto

1. **Clona la repository:**
    - `git clone https://github.com/shadapps/movie-chat-ai.git`

2. **Accedi alla cartella del progetto e installa le dipendenze:**
    - `npm install`

3. **Configura le variabili d'ambiente:**
    - MONGODB_URI=`your_mongodb_connection_string`
    - OPENAI_API_KEY=`your_openai_api_key`

4. **Carica il dataset su MongoDB:**
    - Scarica il file del dataset in formato CSV dal [link sopra riportato](https://www.kaggle.com/datasets/asaniczka/tmdb-movies-dataset-2023-930k-movies).
    - Posiziona il file CSV all'interno del progetto nella cartella `data` con il nome `TMDB_movie_dataset_v11.csv`.
    - Apri il file `config/db.js` e rimuovi il commento dalla linea contenente `await convertCsvToJsonAndImport()` per attivare l'importazione automatica.
    > **Nota:** Rimuovendo il commento, il file verrà importato ogni volta che il programma viene avviato. Ricorda di ricommentare questa linea dopo il primo avvio per evitare caricamenti duplicati.


## 🚀 Funzionalità principali
MovieChat AI mantiene le sessioni di chat per ogni utente utilizzando un sistema di sessioni in memoria. La funzione getResponse gestisce l'interazione con OpenAI per fornire risposte basate sui film del dataset. Chiamata API : `{{url}}/api/{{v}}/assistantResponse`