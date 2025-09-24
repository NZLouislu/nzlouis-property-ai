import React, { RefObject } from "react";
import { Property } from "../properties.type";
import formatNumberWithCommas from "../../utils/formatNumber";

const PropertyCard: React.FC<{ property: Property }> = ({ property }) => {
  return (
    <div
      style={{
        padding: "20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "1px solid #ddd",
        borderRadius: "8px",
        marginBottom: "16px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <a
          href={property.property_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontWeight: "bold", fontSize: "16px", color: "#007bff" }}
        >
          {property.address}
        </a>
        <div style={{ fontSize: "14px" }}>
          {property.suburb}, {property.city}
        </div>
        <div
          style={{
            display: "inline-block",
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              property.predicted_status === "likely" ? "#d4edda" : "#f8f9fa",
            color: property.predicted_status === "likely" ? "#155724" : "#333",
            fontSize: "12px",
            width: "fit-content",
          }}
        >
          {property.predicted_status} ({property.confidence_score})
        </div>
        <div style={{ fontSize: "14px" }}>
          Last sold: {property.last_sold_date} ($
          {formatNumberWithCommas(property.last_sold_price)})
        </div>
        <div style={{ fontSize: "14px" }}>Built: {property.year_built}</div>
        <div style={{ fontSize: "14px" }}>
          Floor: {property.floor_size}, Land Area: {property.land_area}
        </div>
        <div style={{ fontSize: "14px" }}>
          Capital Value: ${formatNumberWithCommas(property.capital_value)}
        </div>
        <div style={{ fontSize: "14px" }}>
          Has Rental History: {property.has_rental_history ? "Yes" : "No"}, Is
          Rented: {property.is_currently_rented ? "Yes" : "No"}
        </div>
        <div style={{ fontSize: "14px" }}>
          Bedrooms: {property.bedrooms}, Bathrooms: {property.bathrooms}, Car
          Spaces: {property.car_spaces}
        </div>
      </div>
    </div>
  );
};

const PropertyList: React.FC<{
  properties: Property[];
  lastPropertyElementRef: RefObject<HTMLDivElement>;
}> = ({ properties, lastPropertyElementRef }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px",
      }}
    >
      {properties.map((p, index) => {
        if (index === properties.length - 1) {
          return (
            <div key={p.id} ref={lastPropertyElementRef}>
              <PropertyCard property={p} />
            </div>
          );
        }
        return <PropertyCard key={p.id} property={p} />;
      })}
    </div>
  );
};

export default PropertyList;
