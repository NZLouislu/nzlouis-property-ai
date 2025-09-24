import React from "react";
import { Genre } from "./Books.type";

export interface GenreListProps {
  genres: Genre[];
  selectedGenre: Genre | null;
  onGenreSelect: (genre: Genre) => void;
}

const GenreList: React.FC<GenreListProps> = ({
  genres,
  selectedGenre,
  onGenreSelect,
}) => {
  const allGenres = [...genres];

  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {allGenres.map((genre) => (
        <li
          key={genre.id}
          onClick={() => onGenreSelect(genre)}
          style={{
            cursor: "pointer",
            padding: "8px",
            backgroundColor:
              genre.id === selectedGenre?.id ? "#3b82f6" : "white",
            color: genre.id === selectedGenre?.id ? "white" : "black",
            borderRadius: "4px",
            marginBottom: "4px",
          }}
        >
          {genre.name}
        </li>
      ))}
    </ul>
  );
};

export default GenreList;
