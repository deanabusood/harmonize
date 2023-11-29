import React, { useState } from "react";
import { searchMovies } from "../util/apiHandler";
import "../css/SearchBar.css";

function SearchBar({ handleMovieSearch }) {
  const [movieTitle, setMovieTitle] = useState("");

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
  };

  const handleEnterKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
    <div className="search-container">
      <label htmlFor="search-form" className="label"></label>
      <input
        id="search-form"
        type="text"
        value={movieTitle}
        onChange={handleInputChange}
        placeholder="Enter movie title"
        onKeyDown={handleEnterKeyPress}
      />
    </div>
  );
}

export default SearchBar;
