const moviesystemContent = {
    movie: `Remember each movie object includes the following fields:
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
                Here is JSON data for reference: ` ,
};

// Esporta l'array
module.exports = { moviesystemContent };