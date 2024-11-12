const openai = require('../config/openaiConfig');
const prompts = require("../utils/Prompt")
const Movie = require("../models/Movie");

//////////////////////////////////////////////////
// ASSISTANT INTERACTIONS
//////////////////////////////////////////////////
exports.getResponse = async (req, res) => {
    try {
        // Recupera e valida `userPrompt`
        const userPrompt = req.body.userPrompt;
        if (!userPrompt || !prompts[userPrompt]) {
            return res.status(400).json({ message: "Prompt non valido o assente" });
        }
        // Set prompt
        const prompt = prompts[userPrompt].prompt;

        // Recupera i dati dal database e limita i risultati
        const data = await Movie.find();
        const jsonMovie = JSON.stringify(data);

        // Includi i dati nel prompt per OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: `Ecco i dati in formato JSON: ${jsonMovie}` },
                { role: 'user', content: prompt }
            ],
            max_tokens: 200
        });
        
        // Set risposta assistant
        const assistant_message = response.choices[0]?.message?.content;
        
        if (!assistant_message) {
            return res.status(500).json({ message: "Risposta non valida da OpenAI" });
        }

        res.status(200).json({ message: assistant_message });
    } catch (err) {
        console.error("Errore nel metodo getResponse:", err);
        res.status(500).json({ message: "Errore del server" });
    }
};