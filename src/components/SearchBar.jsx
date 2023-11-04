import React, { useState } from "react";
import axios from "axios";

function SearchBar({ handleMovieSearch }) {
  const [movieTitle, setMovieTitle] = useState("");

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/search-movies", {
        params: { query: movieTitle },
      });
      //get results data
      const results = response.data.results;
      //filter results to check if it contains genre id
      const filteredResults = results.filter(
        (result) => result.genre_ids && result.genre_ids.length > 0
      );
      const genreIds = filteredResults.map((result) => result.genre_ids);

      handleMovieSearch(filteredResults, genreIds);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input type="text" value={movieTitle} onChange={handleInputChange} />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
