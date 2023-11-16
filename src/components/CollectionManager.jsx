import React, { useState } from "react";
import "./CollectionManager.css";

const CollectionManager = ({ addedSongs }) => {
  const [isCollectionVisible, setCollectionVisible] = useState(false);

  const toggleCollectionVisibility = () => {
    setCollectionVisible(!isCollectionVisible);
  };

  return (
    <div className="collection-manager">
      <button
        onClick={toggleCollectionVisibility}
        className="collection-button"
      >
        Favorites
      </button>
      {isCollectionVisible && (
        <div className="collection-list">
          <h3>Favorites</h3>
          {addedSongs.length === 0 ? (
            <p>No favorites yet.</p>
          ) : (
            <ul>
              {addedSongs.map((song, index) => (
                <li key={index}>{song.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
