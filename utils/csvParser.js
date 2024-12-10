const fs = require("fs");
const csv = require("csv-parser");
const Movie = require("../models/Movie");
// Active csv data import to use it
// await convertCsvToJsonAndImport(CSV_FILE_PATH)

const BATCH_SIZE = 100; // Number of records per batch

const convertCsvToJsonAndImport = (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const movies = []; // Array to store movies read from CSV
    const stream = fs.createReadStream(csvFilePath).pipe(csv()); // Stream CSV file and pipe to parser
    let count = 1;

    stream
      .on("data", (row) => {
        // Event for each row in CSV
        try {
          const movie = {
            // Parse row into a movie object
            id: parseInt(row.id) || null,
            title: row.title || "Untitled",
            vote_average: parseFloat(row.vote_average) || 0,
            vote_count: parseInt(row.vote_count) || 0,
            status: row.status || "Unknown",
            release_date: isNaN(Date.parse(row.release_date))
              ? null
              : new Date(row.release_date),
            revenue: row.revenue ? parseInt(row.revenue) : null,
            runtime: row.runtime ? parseInt(row.runtime) : null,
            adult: row.adult ? row.adult.toLowerCase() === "true" : false, // Convert adult field to boolean
            backdrop_path: row.backdrop_path || "",
            budget: row.budget ? parseInt(row.budget) : null,
            homepage: row.homepage || "",
            imdb_id: row.imdb_id || "",
            original_language: row.original_language || "en",
            original_title: row.original_title || row.title,
            overview: row.overview || "",
            popularity: parseFloat(row.popularity) || 0,
            poster_path: row.poster_path || "",
            tagline: row.tagline || "",
            genres: row.genres
              ? row.genres.split(",").map((genre) => genre.trim())
              : [], // Split string into array
            production_companies: row.production_companies
              ? row.production_companies.split(", ")
              : [],
            production_countries: row.production_countries
              ? row.production_countries.split(", ")
              : [],
            spoken_languages: row.spoken_languages
              ? row.spoken_languages.split(", ")
              : [],
            keywords: row.keywords ? row.keywords.split(", ") : [],
          };

          movies.push(movie); // Add movie to array

          if (movies.length >= BATCH_SIZE) {
            // Check if batch size is reached
            stream.pause(); // Pause stream to process batch
            Movie.insertMany(movies) // Insert batch into database
              .then(() => {
                console.log(
                  `Inserted batch of ${movies.length} movies for ${
                    movies.length * count
                  }`
                );
                count++;
                movies.length = 0; // Clear array for next batch
                stream.resume(); // Resume stream to continue reading
              })
              .catch((error) => {
                stream.destroy(); // Stop stream on error
                reject(error); // Reject promise with error
              });
          }
        } catch (error) {
          console.error("Error parsing row:", row, error); // Log error without stopping stream
        }
      })
      .on("end", () => {
        // Event for end of file
        if (movies.length > 0) {
          // Check for remaining movies
          Movie.insertMany(movies) // Insert remaining movies
            .then(() => {
              console.log(
                "CSV file successfully processed and imported in batches"
              );
              resolve(); // Resolve promise
            })
            .catch(reject); // Reject promise on error
        } else {
          resolve(); // Resolve if no remaining movies
        }
      })
      .on("error", (error) => {
        // Handle CSV read/parse errors
        stream.destroy(); // Stop stream on error
        reject(error); // Reject promise with error
      });
  });
};

module.exports = convertCsvToJsonAndImport;
