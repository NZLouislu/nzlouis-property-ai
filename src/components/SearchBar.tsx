import React from "react";

export interface SearchBarProps {
  searchQuery: string;
  onSearch: (query: string) => void;
  bookCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearch,
  bookCount,
}) => {
  return (
    <div style={{ margin: "16px 0" }}>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => onSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "1px solid var(--input-border)",
          fontSize: "16px",
          backgroundColor: "var(--input-bg)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
};

export default SearchBar;
