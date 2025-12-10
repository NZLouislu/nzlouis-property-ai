import { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

interface AddressSuggestion {
  id: string;
  address: string;
  suburb: string;
  city: string;
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect?: (suggestion: AddressSuggestion) => void;
  city?: string;
  placeholder?: string;
  apiEndpoint?: string;
}

export default function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  city,
  placeholder = 'Search by address...',
  apiEndpoint = API_ENDPOINTS.propertyAutocomplete
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isSelectingRef = useRef(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      // If we just selected an item, don't search again
      if (isSelectingRef.current) {
        isSelectingRef.current = false;
        return;
      }

      if (value.length < 2) {
        setSuggestions([]);
        return;
      }

      setIsLoading(true);
      try {
        const params = new URLSearchParams({ q: value });
        if (city && city !== 'all-cities') {
          params.append('city', city);
        }

        const response = await fetch(`${apiEndpoint}?${params}`);
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value, city, apiEndpoint]);

  const handleSelect = (suggestion: AddressSuggestion) => {
    isSelectingRef.current = true; // Mark as selecting
    onChange(suggestion.address);
    setShowSuggestions(false);
    onSelect?.(suggestion);
  };

  return (
    <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
      <FaSearch
        style={{
          position: 'absolute',
          left: '14px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#718096',
          zIndex: 1,
        }}
      />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        style={{
          padding: '14px 18px 14px 40px',
          borderRadius: '10px',
          border: '2px solid #e2e8f0',
          fontSize: '16px',
          width: '100%',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.2s',
          boxSizing: 'border-box',
        }}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            backgroundColor: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.address}-${index}`}
              onClick={() => handleSelect(suggestion)}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                borderBottom: index < suggestions.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f7fafc';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#fff';
              }}
            >
              <div style={{ fontWeight: '500', color: '#2D3748', marginBottom: '4px' }}>
                {suggestion.address}
              </div>
              <div style={{ fontSize: '14px', color: '#718096' }}>
                {suggestion.suburb}, {suggestion.city}
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading && (
        <div
          style={{
            position: 'absolute',
            right: '14px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#718096',
            fontSize: '14px',
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
}
