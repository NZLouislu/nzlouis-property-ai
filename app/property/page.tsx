"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { usePropertiesData } from "@/src/hooks/usePropertiesData";
import { Property } from "@/src/components/properties.type";
import PropertyList from "@/src/components/Properties/PropertyList";
import { FaSearch } from "react-icons/fa";

export default function PropertyPage() {
  const lastPropertyElementRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const {
    data,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = usePropertiesData(selectedCity, [selectedSuburb]);

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

  const regions = [
    { 
      name: "Auckland", 
      cities: [
        "Auckland - City",
        "Auckland - Franklin",
        "Auckland - Manukau",
        "Auckland - North Shore",
        "Auckland - Papakura",
        "Auckland - Rodney",
        "Auckland - Waitakere"
      ]
    },
    { 
      name: "Wellington", 
      cities: [
        "Carterton District",
        "Kapiti Coast District",
        "Lower Hutt City",
        "Masterton District",
        "Porirua City",
        "South Wairarapa District",
        "Upper Hutt City",
        "Wellington City"
      ]
    }
  ];

  const getCitiesForRegion = () => {
    const region = regions.find(r => r.name === selectedRegion);
    return region ? region.cities : [];
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
        All Properties
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
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setSelectedCity("");
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
          <option value="">Select Region</option>
          {regions.map((region) => (
            <option key={region.name} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>

        {selectedRegion && (
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
            {getCitiesForRegion().map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Error message display */}
      {isError && (
        <div style={{
          padding: "16px",
          marginBottom: "24px",
          backgroundColor: "#fee",
          border: "1px solid #fcc",
          borderRadius: "8px",
          color: "#c33",
          textAlign: "center"
        }}>
          Error loading properties: {error?.message || "Unknown error occurred"}
          <br />
          <small>This may be due to a temporary server issue or database timeout. Please try again later.</small>
        </div>
      )}

      <PropertyList
        properties={filteredProperties}
        lastPropertyElementRef={lastPropertyElementRef as RefObject<HTMLDivElement>}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        isError={isError}
        error={error ?? undefined}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
}