import React, { useState } from "react";

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  //take in user movie title input and calls movie api - goal: retrieve movie's genres
  const handleSearch = () => {
    console.log(`Searching for: ${searchTerm}`);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter a movie title"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button onClick={handleSearch}>Generate</button>
    </div>
  );
}

export default SearchBar;
