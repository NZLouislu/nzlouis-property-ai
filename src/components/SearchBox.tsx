import React from "react";

interface SearchBoxProps {
  value: string;
  onChange: (query: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "8px 12px",
        borderRadius: "4px",
        border: "1px solid #ddd",
        fontSize: "16px",
        margin: "12px 0",
      }}
    />
  );
};

export default SearchBox;
