import React, { useState, useEffect } from 'react';
import { useRegions } from '@/src/hooks/usePropertiesData';
import { Region, City, Suburb } from '@/src/components/properties.type';

interface LocationSelectorProps {
  onSelectionChange?: (selection: {
    region: string;
    city: string;
    suburb: string;
  }) => void;
  defaultRegion?: string;
  defaultCity?: string;
  defaultSuburb?: string;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  onSelectionChange,
  defaultRegion = 'Wellington',
  defaultCity = 'Wellington City',
  defaultSuburb = 'all-suburbs'
}) => {
  const { regions, loading } = useRegions();
  const [selectedRegion, setSelectedRegion] = useState<string>(defaultRegion);
  const [selectedCity, setSelectedCity] = useState<string>(defaultCity);
  const [selectedSuburb, setSelectedSuburb] = useState<string>(defaultSuburb);

  useEffect(() => {
    if (regions.length > 0) {
      const region = regions.find(r => r.name === selectedRegion);
      if (region && region.cities.length > 0) {
        setSelectedCity(region.cities[0].name);
        setSelectedSuburb('all-suburbs');
      }
    }
  }, [selectedRegion, regions]);

  useEffect(() => {
    setSelectedSuburb('all-suburbs');
  }, [selectedCity]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange({
        region: selectedRegion,
        city: selectedCity,
        suburb: selectedSuburb
      });
    }
  }, [selectedRegion, selectedCity, selectedSuburb, onSelectionChange]);

  const getCities = () => {
    const region = regions.find(r => r.name === selectedRegion);
    return region ? region.cities : [];
  };

  const getSuburbs = () => {
    const region = regions.find(r => r.name === selectedRegion);
    if (!region) return [];

    const city = region.cities.find(c => c.name === selectedCity);
    return city ? city.suburbs : [];
  };

  if (loading) {
    return <div>Loading regions...</div>;
  }

  return (
    <div className="location-selector" style={{
      display: "flex",
      gap: "16px",
      width: "100%",
      flexWrap: "wrap"
    }}>
      <div style={{ flex: "1", minWidth: "150px" }}>
        <select
          value={selectedRegion}
          onChange={(e) => setSelectedRegion(e.target.value)}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "2px solid var(--input-border)",
            fontSize: "16px",
            backgroundColor: "var(--input-bg)",
            color: "var(--foreground)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          {regions.map(region => (
            <option key={region.id} value={region.name}>
              {region.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: "1", minWidth: "150px" }}>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "2px solid var(--input-border)",
            fontSize: "16px",
            backgroundColor: "var(--input-bg)",
            color: "var(--foreground)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <option value="">All Cities</option>
          {getCities().map(city => (
            <option key={city.id} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ flex: "1", minWidth: "150px" }}>
        <select
          value={selectedSuburb}
          onChange={(e) => setSelectedSuburb(e.target.value)}
          style={{
            padding: "14px 18px",
            borderRadius: "10px",
            border: "2px solid var(--input-border)",
            fontSize: "16px",
            backgroundColor: "var(--input-bg)",
            color: "var(--foreground)",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
            cursor: "pointer",
            width: "100%",
            boxSizing: "border-box"
          }}
        >
          <option value="all-suburbs">All Suburbs</option>
          {getSuburbs().map(suburb => (
            <option key={suburb.id} value={suburb.name}>
              {suburb.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LocationSelector;