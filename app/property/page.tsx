"use client";

import { useState, useEffect, useRef, RefObject } from "react";
import { usePropertiesData } from "@/src/hooks/usePropertiesData";
import { Property } from "@/src/components/properties.type";
import PropertyList from "@/src/components/Properties/PropertyList";
import LocationSelector from "@/src/components/LocationSelector";
import AddressAutocomplete from "@/src/components/AddressAutocomplete";

export default function PropertyPage() {
  const lastPropertyElementRef = useRef<HTMLDivElement>(null);
  const [selectedCity, setSelectedCity] = useState("Auckland");
  const [selectedSuburb, setSelectedSuburb] = useState<string>("all-suburbs");

  const [inputValue, setInputValue] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isExactSearch, setIsExactSearch] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | undefined>();

  const suburbsForQuery = selectedSuburb === "all-suburbs" ? undefined : [selectedSuburb];

  console.log("PropertyPage rendering with:", { selectedCity, selectedSuburb, suburbsForQuery, searchQuery, isExactSearch, selectedPropertyId });

  const {
    data,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
  } = usePropertiesData(selectedCity, suburbsForQuery, searchQuery, isExactSearch, selectedPropertyId);

  const propertiesData = data as { pages: Property[][] } | undefined;

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('propertyScrollPosition');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
      }, 100);
    }

    const handleBeforeUnload = () => {
      sessionStorage.setItem('propertyScrollPosition', window.scrollY.toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  useEffect(() => {
    console.log("IntersectionObserver effect triggered", { hasNextPage, isFetchingNextPage });

    const currentElement = lastPropertyElementRef.current;
    if (!currentElement) {
      console.log("No element to observe");
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      console.log("IntersectionObserver callback", {
        isIntersecting: entries[0].isIntersecting,
        hasNextPage,
        isFetchingNextPage
      });

      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        console.log("Fetching next page...");
        fetchNextPage();
      }
    }, { threshold: 1.0 });

    observer.observe(currentElement);

    return () => {
      console.log("Disconnecting observer");
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, propertiesData]);

  const properties: Property[] = propertiesData
    ? propertiesData.pages.flatMap((page) => page)
    : [];

  const handleLocationChange = (selection: {
    region: string;
    city: string;
    suburb: string
  }) => {
    console.log("Location changed:", selection);
    if (selection.city !== selectedCity || selection.suburb !== selectedSuburb) {
      sessionStorage.removeItem('propertyScrollPosition');
    }
    setSelectedCity(selection.city);
    setSelectedSuburb(selection.suburb);
  };

  const filteredProperties = properties;

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
        Properties
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
              defaultRegion="Wellington"
              defaultCity="Wellington City"
              defaultSuburb="all-suburbs"
            />
          </div>
        </div>

        <AddressAutocomplete
          value={inputValue}
          city={selectedCity}
          onChange={(val) => {
            setInputValue(val);
            if (val === "") {
              setSearchQuery("");
              setIsExactSearch(false);
              setSelectedPropertyId(undefined);
            }
          }}
          onSelect={(suggestion) => {
            console.log("🎯 Selected suggestion:", suggestion);
            console.log("🆔 Setting property ID to:", suggestion.id, "type:", typeof suggestion.id);
            setInputValue(suggestion.address);
            // Use property ID for the most reliable search (ID is already a string)
            setSelectedPropertyId(suggestion.id);
            setSearchQuery("");
            setIsExactSearch(false);
          }}
          placeholder={`Search by address in ${selectedCity} (e.g., 24 Main Street)...`}
        />
      </div>

      {isError && (
        <div style={{
          padding: "16px",
          marginBottom: "24px",
          backgroundColor: "var(--error-bg)",
          border: "1px solid var(--error-border)",
          borderRadius: "8px",
          color: "var(--error-text)",
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