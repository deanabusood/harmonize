import React, { useState } from "react";
import { searchMovies } from "../services/ApiService";

function SearchBar({ handleMovieSearch }) {
  const [movieTitle, setMovieTitle] = useState("");

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleSearch = async () => {
    try {
      const { results, genreIds } = await searchMovies(movieTitle); //call ApiService.js

      handleMovieSearch(results, genreIds);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        id="search-form"
        type="text"
        value={movieTitle}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
