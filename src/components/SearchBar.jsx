import axios from "axios";
import React, { useState } from "react";

function SearchBar() {
  const [movieTitle, setmovieTitle] = useState("");

  const handleInputChange = (event) => {
    setmovieTitle(event.target.value);
  };

  //take in user movie title input and calls movie api - goal: retrieve movie's genres
  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/search-movies", {
        params: { query: movieTitle },
      });

      //handle api response data
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a movie title"
        value={movieTitle}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Generate</button>
    </div>
  );
}

export default SearchBar;
