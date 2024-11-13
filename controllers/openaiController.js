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
                { role: 'system', content: `${systemContent.movie} ${jsonMovie}` },
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
