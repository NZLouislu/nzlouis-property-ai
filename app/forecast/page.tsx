"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { useForecastData } from "@/src/hooks/useForecastData";
import { Property } from "@/src/components/properties.type";
import PropertyList from "@/src/components/Properties/PropertyList";
import LocationSelector from "@/src/components/LocationSelector";
import AddressAutocomplete from "@/src/components/AddressAutocomplete";

export default function ForecastPage() {
  const lastPropertyElementRef = useRef<HTMLDivElement>(null);
  const [selectedRegion, setSelectedRegion] = useState("Auckland");
  const [selectedCity, setSelectedCity] = useState("Auckland");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("all-suburbs");

  // inputValue controls the input field and autocomplete
  const [inputValue, setInputValue] = useState<string>("");

  // searchQuery controls the actual property list fetching (not implemented in useForecastData yet, but good for future)
  // For now, forecast page still uses client-side filtering for simplicity, or we can update it later.
  // But to fix the "input triggers reload" issue, we should separate them.
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
  } = useForecastData(selectedCity, selectedSuburb === "all-suburbs" ? [] : [selectedSuburb]);

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

  const handleLocationChange = (selection: {
    region: string;
    city: string;
    suburb: string
  }) => {
    setSelectedRegion(selection.region);
    setSelectedCity(selection.city);
    setSelectedSuburb(selection.suburb);
  };

  // Client-side filtering for forecast page (as it was before)
  // But now it filters based on searchQuery (set on select/enter) instead of inputValue
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
        Forecast Properties
      </h1>

      <div
        style={{
          marginBottom: "32px",
          padding: "20px",
          backgroundColor: "var(--card-bg)",
          borderRadius: "12px",
          boxShadow: "var(--shadow)",
          border: "1px solid var(--card-border)",
        }}
      >
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px",
          flexWrap: "wrap",
        }}>
          <div style={{ flex: "1", minWidth: "200px" }}>
            <LocationSelector
              onSelectionChange={handleLocationChange}
              defaultRegion="Auckland"
              defaultCity="Auckland"
              defaultSuburb="all-suburbs"
            />
          </div>
        </div>

        <AddressAutocomplete
          value={inputValue}
          onChange={(val) => {
            setInputValue(val);
            if (val === "") {
              setSearchQuery("");
            }
          }}
          onSelect={(suggestion) => {
            setInputValue(suggestion.address);
            setSearchQuery(suggestion.address);
          }}
          placeholder="Search forecast properties by address (e.g., 24 Main Street)..."
          apiEndpoint="/api/forecast/autocomplete"
        />
      </div>

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