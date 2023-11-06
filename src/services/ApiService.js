import axios from "axios";

const BASE_URL = "http://localhost:8000"; // server running on port 8000

export async function searchMovies(query) {
  try {
    const response = await axios.get(`${BASE_URL}/search-movies`, {
      params: { query: query },
    });

    // filter api result (only return movies with genre ids)
    const results = response.data.results;
    const filteredResults = results.filter(
      (result) => result.genre_ids && result.genre_ids.length > 0
    );
    const genreIds = filteredResults.map((result) => result.genre_ids);

    return { results: filteredResults, genreIds };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function searchSpotify(query) {}
