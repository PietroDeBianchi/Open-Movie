const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
    {
        id: { type: Number, unique: true, required: true },
        title: { type: String, required: true },
        vote_average: { type: Number },
        vote_count: { type: Number },
        status: { type: String },
        release_date: { type: Date },
        revenue: { type: Number },
        runtime: { type: Number },
        adult: { type: Boolean },
        backdrop_path: { type: String },
        budget: { type: Number },
        homepage: { type: String },
        imdb_id: { type: String },
        original_language: { type: String },
        original_title: { type: String },
        overview: { type: String },
        popularity: { type: Number },
        poster_path: { type: String },
        tagline: { type: String },
        genres: [{ type: String }],
        production_companies: [{ type: String }],
        production_countries: [{ type: String }],
        spoken_languages: [{ type: String }],
        keywords: [{ type: String }]
    },
    {
        versionKey: false,
        collection: "movies",
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    }
);

module.exports = mongoose.model('movies', movieSchema);
