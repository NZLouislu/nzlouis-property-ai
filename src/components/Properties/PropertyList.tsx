import React, { RefObject } from "react";
import { Property } from "../properties.type";
import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaDollarSign,
  FaHeart,
  FaShareAlt,
} from "react-icons/fa";

const PropertyCard: React.FC<{
  property: Property;
  onFavoriteToggle?: (id: string) => void;
  isFavorite?: boolean;
}> = ({ property, onFavoriteToggle, isFavorite }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-8px)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 12px 24px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 8px 16px rgba(0,0,0,0.08)";
      }}
    >
      <div style={{ position: "relative" }}>
        <a
          href={property.property_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            height: "220px",
            textDecoration: "none",
            color: "inherit",
          }}
        >
          {property.cover_image_url ? (
            <img
              src={property.cover_image_url}
              alt={property.address}
              style={{
                width: "100%",
                height: "220px",
                objectFit: "cover",
              }}
            />
          ) : (
            <div
              style={{
                height: "220px",
                background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#4a5568",
                fontSize: "16px",
                fontWeight: "600",
                position: "relative",
              }}
            >
              <div
                style={{
                  backgroundColor: "#e2e8f0",
                  width: "80%",
                  height: "70%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: "2px dashed #94a3b8",
                }}
              >
                <span
                  style={{
                    color: "#64748b",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                >
                  No Image Available
                </span>
              </div>
              <div
                style={{
                  marginTop: "12px",
                  color: "#475569",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                Default Property Image
              </div>
            </div>
          )}
        </a>
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle?.(property.id);
            }}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <FaHeart
              style={{
                color: isFavorite ? "#e53e3e" : "#a0aec0",
                fontSize: "18px",
              }}
            />
          </button>
          <button
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          >
            <FaShareAlt style={{ color: "#4a5568", fontSize: "16px" }} />
          </button>
        </div>
        {property.region && (
          <div
            style={{
              position: "absolute",
              bottom: "16px",
              left: "16px",
              backgroundColor: "rgba(34, 197, 94, 0.9)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: "600",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            {property.region}
          </div>
        )}
      </div>

      <div
        style={{
          padding: "24px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#2d3748",
              flex: 1,
              lineHeight: "1.3",
            }}
          >
            {property.address}
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "18px",
            color: "#718096",
            fontSize: "0.95rem",
          }}
        >
          <FaMapMarkerAlt style={{ marginRight: "8px", fontSize: "1rem" }} />
          <span>
            {property.suburb}, {property.city}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <FaDollarSign
                style={{
                  marginRight: "6px",
                  color: "#22c55e",
                  fontSize: "1rem",
                }}
              />
              <span
                style={{
                  fontWeight: "700",
                  color: "#2d3748",
                  fontSize: "1.4rem",
                }}
              >
                {formatCurrency(property.last_sold_price)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <FaDollarSign
                style={{
                  marginRight: "6px",
                  color: "#718096",
                  fontSize: "0.9rem",
                }}
              />
              <span
                style={{
                  fontWeight: "500",
                  color: "#718096",
                  fontSize: "0.9rem",
                }}
              >
                Last sold: {formatCurrency(property.last_sold_price)} (
                {property.last_sold_date})
              </span>
            </div>
            {property.confidence_score && (
              <div
                style={
                  {
                    backgroundColor:
                      property.confidence_score > 0.7
                        ? "#dcfce7"
                        : property.confidence_score > 0.5
                        ? "#fef9c3"
                        : "#fee2e2",
                    color:
                      property.confidence_score > 0.7
                        ? "#166534"
                        : property.confidence_score > 0.5
                        ? "#854d0e"
                        : "#991b1b",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    fontSize: "0.85rem",
                    fontWeight: "600",
                    border: `1px solid ${
                      property.confidence_score > 0.7
                        ? "#bbf7d0"
                        : property.confidence_score > 0.5
                        ? "#fde047"
                        : "#fecaca"
                    }`,
                    marginTop: "10px",
                    display: "inline-block",
                  }
                }
              >
                {Math.round(property.confidence_score * 100)}%
                confidence
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            borderTop: "1px solid #edf2f7",
            paddingTop: "20px",
            marginTop: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              textAlign: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "6px",
                }}
              >
                <FaBed
                  style={{
                    marginRight: "6px",
                    color: "#718096",
                    fontSize: "1.1rem",
                  }}
                />
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2d3748",
                    fontSize: "1.1rem",
                  }}
                >
                  {property.bedrooms}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  fontWeight: "500",
                }}
              >
                Beds
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "6px",
                }}
              >
                <FaBath
                  style={{
                    marginRight: "6px",
                    color: "#718096",
                    fontSize: "1.1rem",
                  }}
                />
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2d3748",
                    fontSize: "1.1rem",
                  }}
                >
                  {property.bathrooms}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  fontWeight: "500",
                }}
              >
                Baths
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "6px",
                }}
              >
                <FaCar
                  style={{
                    marginRight: "6px",
                    color: "#718096",
                    fontSize: "1.1rem",
                  }}
                />
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2d3748",
                    fontSize: "1.1rem",
                  }}
                >
                  {property.car_spaces}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  fontWeight: "500",
                }}
              >
                Cars
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "6px",
                }}
              >
                <FaRulerCombined
                  style={{
                    marginRight: "6px",
                    color: "#718096",
                    fontSize: "1.1rem",
                  }}
                />
                <span
                  style={{
                    fontWeight: "600",
                    color: "#2d3748",
                    fontSize: "1.1rem",
                  }}
                >
                  {property.land_area}
                </span>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#718096",
                  fontWeight: "500",
                }}
              >
                m²
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyList: React.FC<{
  properties: Property[];
  lastPropertyElementRef?: RefObject<HTMLDivElement>;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  isError?: boolean;
  error?: Error;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  favorites?: Set<string>;
  onFavoriteToggle?: (id: string) => void;
}> = ({
  properties,
  lastPropertyElementRef,
  isLoading,
  isFetchingNextPage,
  isError,
  error,
  fetchNextPage,
  hasNextPage,
  favorites = new Set(),
  onFavoriteToggle,
}) => {
  if (isLoading) {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px",
        }}
      >
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
              backgroundColor: "#fff",
              height: "400px",
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                height: "220px",
                backgroundColor: "#f1f5f9",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            ></div>
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  height: "24px",
                  backgroundColor: "#f1f5f9",
                  marginBottom: "12px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
              <div
                style={{
                  height: "18px",
                  backgroundColor: "#f1f5f9",
                  marginBottom: "10px",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
              <div
                style={{
                  height: "18px",
                  backgroundColor: "#f1f5f9",
                  animation: "pulse 1.5s ease-in-out infinite",
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 30px",
          color: "#e53e3e",
          backgroundColor: "#fff5f5",
          borderRadius: "12px",
          border: "1px solid #fed7d7",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <h3 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>
          Error loading properties
        </h3>
        <p style={{ fontSize: "1rem", whiteSpace: "pre-line" }}>
          {error?.message || "Failed to load properties"}
        </p>
        {error?.message?.includes("timeout") && (
          <p style={{ 
            fontSize: "0.9rem", 
            marginTop: "16px", 
            color: "#718096",
            fontStyle: "italic"
          }}>
            This may be due to a temporary server issue or database timeout. Please try again later.
          </p>
        )}
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "80px 30px",
          color: "#718096",
          backgroundColor: "#f8fafc",
          borderRadius: "16px",
          border: "1px solid #e2e8f0",
        }}
      >
        <h3
          style={{
            fontSize: "1.8rem",
            marginBottom: "16px",
            color: "#4a5568",
          }}
        >
          No properties found
        </h3>
        <p style={{ fontSize: "1.1rem" }}>Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "30px",
        }}
      >
        {properties.map((p, index) => {
          const ref =
            index === properties.length - 1 && lastPropertyElementRef
              ? lastPropertyElementRef
              : undefined;
          return (
            <div key={`${p.id}-${index}`} ref={ref}>
              <PropertyCard
                property={p}
                onFavoriteToggle={onFavoriteToggle}
                isFavorite={favorites.has(p.id)}
              />
            </div>
          );
        })}
      </div>

      {isFetchingNextPage && (
        <div
          style={{
            textAlign: "center",
            padding: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              border: "4px solid #f3f4f6",
              borderTop: "4px solid #3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          ></div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default PropertyList;
