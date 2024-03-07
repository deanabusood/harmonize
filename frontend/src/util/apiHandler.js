import axios from "axios";

const BASE_URL = "https://harmonize-server.onrender.com"; //server running on port 8000

//TMDB API
export async function searchMovies(query) {
  try {
    const response = await axios.get(`${BASE_URL}/movies/search-movies`, {
      params: { query: query },
    });

    //filter api result (only return movies with genre ids)
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

//SPOTIFY API
export async function searchSpotifyRecommendations(seedGenres) {
  try {
    const response = await axios.get(
      `${BASE_URL}/spotify/get-spotify-recommendations`,
      {
        params: {
          seed_genres: seedGenres,
          limit: 20, //fixed at 20
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

//POST USER FAVORITES
export const addToUserFavorites = async (selectedSong, token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/favorites/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ selectedSong }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//POST REMOVAL
export const removeFromUserFavorites = async (songId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/user/favorites/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ songId }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

//RETRIEVE FAVORITES
export const getUserFavorites = async (token) => {
  try {
    const response = await axios.get(`${BASE_URL}/user/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.favorites;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
