import { useState, useEffect, useRef } from "react";
import { usePropertiesData } from "../../hooks/usePropertiesData";
import { Property } from "../../components/properties.type";
import {
  FaBed,
  FaBath,
  FaCar,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaDollarSign,
  FaChartLine,
  FaHeart,
  FaShareAlt,
  FaSearch,
} from "react-icons/fa";

const Properties: React.FC = () => {
  const lastPropertyElementRef = useRef<HTMLDivElement | null>(null);
  const [selectedCity, setSelectedCity] = useState("Wellington City");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const {
    data,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = usePropertiesData(selectedCity, [selectedSuburb]);

  // 将 data 转换为正确的类型
  const propertiesData = data as { pages: Property[][] } | undefined;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );
    const currentElement = lastPropertyElementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const properties: Property[] = propertiesData
    ? propertiesData.pages.flatMap((page) => page)
    : [];

  const wellingtonSuburbs: string[] = [
    "Khandallah",
    "Ngaio",
    "Tawa",
    "Newlands",
    "Woodridge",
    "Johnsonville",
    "Churton Park",
    "Kaiwharawhara",
    "Karori",
  ];

  const aucklandSuburbs: string[] = [
    "Auckland City Centre",
    "Epsom",
    "Mount Eden",
    "Remuera",
    "Parnell",
    "Newmarket",
    "Greenlane",
    "Panmure",
    "Glen Innes",
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NZ", {
      style: "currency",
      currency: "NZD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSuburbsForCity = () => {
    if (selectedCity === "Wellington City") {
      return wellingtonSuburbs;
    } else if (selectedCity === "Auckland") {
      return aucklandSuburbs;
    }
    return [];
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(propertyId)) {
        newFavorites.delete(propertyId);
      } else {
        newFavorites.add(propertyId);
      }
      return newFavorites;
    });
  };

  // Filter properties based on search query
  const filteredProperties: Property[] = properties.filter((property) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      property.address.toLowerCase().includes(query) ||
      property.suburb.toLowerCase().includes(query) ||
      property.city.toLowerCase().includes(query) ||
      (property.category && property.category.toLowerCase().includes(query))
    );
  });

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px" }}>
      <h1
        style={{
          marginBottom: "24px",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#2D3748",
          textAlign: "center",
          background: "linear-gradient(135deg, #007bff, #00bcd4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Predicted Properties
      </h1>

      <div
        style={{
          display: "flex",
          gap: "16px",
          marginBottom: "32px",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "#f8f9fa",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        }}
      >
        <div style={{ position: "relative", minWidth: "220px" }}>
          <FaSearch
            style={{
              position: "absolute",
              left: "14px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#718096",
            }}
          />
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "14px 18px 14px 40px",
              borderRadius: "10px",
              border: "2px solid #e2e8f0",
              fontSize: "16px",
              width: "100%",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
            }}
          />
        </div>

        <select
          value={selectedCity}
          onChange={(e) => {
            setSelectedCity(e.target.value);
            setSelectedSuburb("");
          }}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "2px solid #e2e8f0",
            fontSize: "16px",
            minWidth: "220px",
            backgroundColor: "#fff",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
            cursor: "pointer",
          }}
        >
          <option value="">Select City</option>
          <option value="Wellington City">Wellington</option>
          <option value="Auckland">Auckland</option>
        </select>

        {selectedCity && (
          <select
            value={selectedSuburb}
            onChange={(e) => setSelectedSuburb(e.target.value)}
            style={{
              padding: "14px 18px",
              borderRadius: "10px",
              border: "2px solid #e2e8f0",
              fontSize: "16px",
              minWidth: "220px",
              backgroundColor: "#fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "all 0.2s",
              cursor: "pointer",
            }}
          >
            <option value="">All Suburbs</option>
            {getSuburbsForCity().map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </select>
        )}
      </div>

      {isLoading && !isFetchingNextPage ? (
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
      ) : isError ? (
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
          <p style={{ fontSize: "1rem" }}>
            {(error as Error)?.message || "Failed to load properties"}
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "30px",
            }}
          >
            {filteredProperties.map((property, index) => (
              <div
                key={property.id}
                ref={
                  index === filteredProperties.length - 1
                    ? lastPropertyElementRef
                    : null
                }
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
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(-8px)";
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform =
                    "translateY(0)";
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
                    <div
                      style={{
                        height: "220px",
                        backgroundImage:
                          "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#4a5568",
                        fontSize: "16px",
                        fontWeight: "600",
                      }}
                    >
                      View Property
                    </div>
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
                      onClick={() => toggleFavorite(property.id)}
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
                        (e.target as HTMLElement).style.transform =
                          "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = "scale(1)";
                      }}
                    >
                      <FaHeart
                        style={{
                          color: favorites.has(property.id)
                            ? "#e53e3e"
                            : "#a0aec0",
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
                        (e.target as HTMLElement).style.transform =
                          "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = "scale(1)";
                      }}
                    >
                      <FaShareAlt
                        style={{ color: "#4a5568", fontSize: "16px" }}
                      />
                    </button>
                  </div>
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
                    {property.category}
                  </div>
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
                    <FaMapMarkerAlt
                      style={{ marginRight: "8px", fontSize: "1rem" }}
                    />
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
                          {formatCurrency(property.price)}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FaChartLine
                          style={{
                            marginRight: "6px",
                            color: "#3b82f6",
                            fontSize: "1rem",
                          }}
                        />
                        <span
                          style={{
                            fontWeight: "600",
                            color: "#3b82f6",
                            fontSize: "1rem",
                          }}
                        >
                          Predicted: {formatCurrency(property.predicted_price)}
                        </span>
                      </div>
                    </div>

                    {property.confidence_score && (
                      <div
                        style={{
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
                        }}
                      >
                        {Math.round(property.confidence_score * 100)}%
                        confidence
                      </div>
                    )}
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
            ))}
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

          {filteredProperties.length === 0 && !isLoading && (
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
              <p style={{ fontSize: "1.1rem" }}>
                Try selecting a different city or suburb
              </p>
            </div>
          )}
        </>
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
    </div>
  );
};

export default Properties;
