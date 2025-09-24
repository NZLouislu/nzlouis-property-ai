import React from "react";

interface ListGroupProps {
  items: any[];
  textProperty?: string;
  valueProperty?: string;
  selectedItem: any;
  onItemSelect: (item: any) => void;
}

const ListGroup: React.FC<ListGroupProps> = ({
  items,
  textProperty = "name",
  valueProperty = "id",
  selectedItem,
  onItemSelect,
}) => {
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
      {items.map((item) => (
        <li
          key={item[valueProperty]}
          onClick={() => onItemSelect(item)}
          style={{
            cursor: "pointer",
            padding: "8px",
            backgroundColor: item === selectedItem ? "#3b82f6" : "white",
            color: item === selectedItem ? "white" : "black",
            borderRadius: "4px",
            marginBottom: "4px",
          }}
        >
          {item[textProperty]}
        </li>
      ))}
    </ul>
  );
};

export default ListGroup;
