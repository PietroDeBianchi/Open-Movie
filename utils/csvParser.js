const fs = require('fs');
const csv = require('csv-parser');
const Movie = require('../models/Movie')

const BATCH_SIZE = 100; // Numero di record per ogni batch

const convertCsvToJsonAndImport = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        const movies = []; // Array per memorizzare i film letti dal CSV
        const stream = fs.createReadStream(csvFilePath).pipe(csv()); // Crea uno stream di lettura per il file CSV e lo collega al parser CSV

        stream
            .on('data', (row) => { // Event listener per ogni riga del CSV
                const movie = { // Parsing e trasformazione dei dati della riga corrente in un oggetto "movie"
                    id: parseInt(row.id),
                    title: row.title,
                    vote_average: parseFloat(row.vote_average),
                    vote_count: parseInt(row.vote_count),
                    status: row.status,
                    release_date: isNaN(Date.parse(row.release_date)) ? null : new Date(row.release_date),
                    revenue: row.revenue ? parseInt(row.revenue) : null,
                    runtime: row.runtime ? parseInt(row.runtime) : null,
                    adult: row.adult && row.adult.toLowerCase() === 'true', // Converte il campo "adult" in un booleano
                    backdrop_path: row.backdrop_path,
                    budget: row.budget ? parseInt(row.budget) : null,
                    homepage: row.homepage,
                    imdb_id: row.imdb_id,
                    original_language: row.original_language,
                    original_title: row.original_title,
                    overview: row.overview,
                    popularity: parseFloat(row.popularity),
                    poster_path: row.poster_path,
                    tagline: row.tagline,
                    genres: row.genres ? row.genres.split(', ') : [], // Divide le stringhe multiple in array, se presenti
                    production_companies: row.production_companies ? row.production_companies.split(', ') : [],
                    production_countries: row.production_countries ? row.production_countries.split(', ') : [],
                    spoken_languages: row.spoken_languages ? row.spoken_languages.split(', ') : [],
                    keywords: row.keywords ? row.keywords.split(', ') : []
                };

                movies.push(movie); // Aggiunge il film corrente all'array "movies"

                if (movies.length >= BATCH_SIZE) { // Controlla se è stato raggiunto il limite del batch
                    stream.pause(); // Pausa lo stream per processare i dati in batch
                    Movie.insertMany(movies) // Inserisce il batch nel database
                        .then(() => {
                            movies.length = 0; // Svuota l'array per il prossimo batch
                            stream.resume(); // Riprende lo stream per continuare a leggere
                        })
                        .catch((error) => {
                            stream.destroy(); // Ferma lo stream in caso di errore
                            reject(error); // Rigetta la promise con l'errore
                        });
                }
            })
            .on('end', () => { // Event listener per la fine del file
                if (movies.length > 0) { // Controlla se ci sono film rimasti non inseriti
                    Movie.insertMany(movies) // Inserisce i rimanenti film nel database
                        .then(() => {
                            console.log('CSV file successfully processed and imported in batches');
                            resolve(); // Risolve la promise con successo
                        })
                        .catch(reject); // Rigetta la promise se si verifica un errore
                } else {
                    resolve(); // Risolve la promise se non ci sono film rimanenti
                }
            })
            .on('error', (error) => { // Gestisce gli errori di lettura o parsing del CSV
                stream.destroy(); // Ferma lo stream in caso di errore
                reject(error); // Rigetta la promise con l'errore
            });
    });
};

module.exports = convertCsvToJsonAndImport;