const fs = require('fs');
const csv = require('csv-parser');

const convertCsvToJson = (csvFilePath) => {
    return new Promise((resolve, reject) => {
        const movies = [];

        fs.createReadStream(csvFilePath)
            .pipe(csv())
            .on('data', (row) => {
                const movie = {
                    id: parseInt(row.id),
                    title: row.title,
                    vote_average: parseFloat(row.vote_average),
                    vote_count: parseInt(row.vote_count),
                    status: row.status,
                    release_date: new Date(row.release_date),
                    revenue: row.revenue ? parseInt(row.revenue) : null,
                    runtime: row.runtime ? parseInt(row.runtime) : null,
                    adult: row.adult.toLowerCase() === 'true',
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
                    genres: row.genres ? row.genres.split(', ') : [],
                    production_companies: row.production_companies ? row.production_companies.split(', ') : [],
                    production_countries: row.production_countries ? row.production_countries.split(', ') : [],
                    spoken_languages: row.spoken_languages ? row.spoken_languages.split(', ') : [],
                    keywords: row.keywords ? row.keywords.split(', ') : []
                };

                movies.push(movie);
            })
            .on('end', () => {
                console.log('CSV file successfully processed');
                resolve(movies);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

module.exports = convertCsvToJson;