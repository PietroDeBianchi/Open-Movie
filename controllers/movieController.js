const openai = require('../config/openaiConfig');
const systemContent = require("../utils/systemContent");
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

// In-memory storage for user sessions
const sessions = {};

exports.movieSession = async (req, res) => {
    try {
        const { prompt, chatId } = req.body;
        
        // Check if the prompt is valid
        if (!prompt) {
            return res.status(400).json({ message: "Invalid or missing prompt" });
        }

        // Initialize a new session if it doesn't exist
        if (!sessions[chatId]) {
            // Fetch movie data and format it as JSON
            const data = await fetchMovies(20);
            const jsonMovie = JSON.stringify(data);
            // Add initial system message with context and movie data
            sessions[chatId] = [
                { role: 'system', content: `${systemContent.movie} ${jsonMovie}` },
            ];
        }
        
        // Add user's prompt to the session conversation history
        sessions[chatId].push({ role: 'user', content: prompt });

        // Send conversation history to OpenAI for processing
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: sessions[chatId],
            max_tokens: 800 // Limit the response length
        });

        // Extract assistant's response
        const assistantMessage = response.choices[0]?.message?.content;

        // Handle cases where no valid response is returned
        if (!assistantMessage) {
            return res.status(500).json({ message: "Invalid response from OpenAI" });
        }
        // Add assistant's response to the session history
        sessions[chatId].push({ role: 'assistant', content: assistantMessage });

        // Return assistant's response to the client
        res.status(200).json({ message: assistantMessage});
    } catch (err) {
        console.error("Error in movieSession:", err);
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
