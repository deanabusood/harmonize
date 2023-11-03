import React, { useState } from "react";
import axios from "axios";

function SearchBar({ onSearch }) {
  const [movieTitle, setMovieTitle] = useState("");

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/search-movies", {
        params: { query: movieTitle },
      });

      const results = response.data.results;
      const genreIds = results.map((result) => result.genre_ids);
      onSearch(results, genreIds);
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
