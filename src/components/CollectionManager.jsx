import React, { useState } from "react";
import "../css/CollectionManager.css";

const CollectionManager = ({ addedSongs, onRemoveClick }) => {
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
                <li key={index}>
                  <span className="song-details">
                    <a
                      href={song.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <b>{song.name}</b>
                    </a>{" "}
                    by {song.artists.map((artist) => artist.name).join(", ")}
                  </span>
                  <button onClick={() => onRemoveClick(index)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CollectionManager;
