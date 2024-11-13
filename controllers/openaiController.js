const openai = require('../config/openaiConfig');
const prompts = require("../utils/Prompt");
const Movie = require("../models/Movie");

//////////////////////////////////////////////////
// FETCH MOVIES DATA (internal use)
//////////////////////////////////////////////////
const fetchMovies = async (limit = 100) => {
    try {
        return await Movie.find().limit(limit);
    } catch (err) {
        console.error("Error in fetchMovies:", err);
        throw err; // Propagate error for handling in calling function
    }
};

//////////////////////////////////////////////////
// ASSISTANT INTERACTIONS
//////////////////////////////////////////////////
exports.getResponse = async (req, res) => {
    try {
        const userPrompt = req.body.userPrompt;
        if (!userPrompt) {
            return res.status(400).json({ message: "Invalid or missing prompt" });
        }

        // Set prompt and fetch limited data
        const prompt = userPrompt;
        const data = await fetchMovies(20);
        const jsonMovie = JSON.stringify(data);

        // Send data in prompt to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `Remember each movie object includes the following fields:
                    - id (Number, unique, required): Unique identifier for the movie.
                    - title (String, required): The title of the movie.
                    - vote_average (Number): The average user rating for the movie.
                    - vote_count (Number): The total number of votes received.
                    - status (String): The release status (e.g., "Released", "Planned").
                    - release_date (Date): The release date of the movie.
                    - revenue (Number): Total revenue generated.
                    - runtime (Number): Duration of the movie in minutes.
                    - adult (Boolean): Whether the movie is for adults.
                    - backdrop_path (String): Path to the backdrop image.
                    - budget (Number): Total budget allocated for the movie.
                    - homepage (String): URL of the official movie homepage.
                    - imdb_id (String): IMDb identifier.
                    - original_language (String): The language code of the original language.
                    - original_title (String): Original title of the movie.
                    - overview (String): Summary of the movie plot.
                    - popularity (Number): Popularity score.
                    - poster_path (String): Path to the poster image.
                    - tagline (String): Tagline or slogan of the movie.
                    - genres ([String]): List of genres the movie belongs to.
                    - production_companies ([String]): List of production companies involved.
                    - production_countries ([String]): List of countries involved in production.
                    - spoken_languages ([String]): List of spoken languages in the movie.
                    - keywords ([String]): List of keywords associated with the movie.
                    Here is JSON data for reference: ${jsonMovie}` },
                { role: 'user', content: prompt }
            ],
            // set max tokens for response
            // max_tokens: 600
        });
        
        // Extract and send assistant's response
        const assistant_message = response.choices[0]?.message?.content;
        
        if (!assistant_message) {
            return res.status(500).json({ message: "Invalid response from OpenAI" });
        }

        res.status(200).json({ message: assistant_message });
    } catch (err) {
        console.error("Error in getResponse:", err);
        res.status(500).json({ message: "Server error" });
    }
};

//////////////////////////////////////////////////
// GET MOVIES DATA (API)
//////////////////////////////////////////////////
exports.getMovies = async (req, res) => {
    try {
        const limit = 100;
        const movies = await fetchMovies(limit);
        res.status(200).json(movies);
    } catch (err) {
        console.error("Error in getMovies:", err);
        res.status(500).json({ message: "Server error" });
    }
};
