/**
 * @jest-environment jsdom
 */
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePropertiesData } from '../hooks/usePropertiesData';
import { fetchPropertiesByCity } from '../services/propertyService';
import { Property } from '../components/properties.type';
import React from 'react';

jest.mock('../services/propertyService');

const mockFetchPropertiesByCity = fetchPropertiesByCity as jest.MockedFunction<typeof fetchPropertiesByCity>;

const createMockProperties = (count: number, suburb: string): Property[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${suburb}-${i}`,
    address: `${i} Test St`,
    suburb,
    city: 'Wellington City',
    postcode: '6022',
    year_built: 2000,
    bedrooms: 3,
    bathrooms: 2,
    car_spaces: 2,
    floor_size: '150m²',
    land_area: '800m²',
    last_sold_price: 1000000,
    last_sold_date: new Date('2023-01-01'),
    capital_value: 1200000,
    land_value: 400000,
    improvement_value: 800000,
    has_rental_history: true,
    category: 'House',
    property_url: `https://example.com/property/${i}`,
    cover_image_url: `https://example.com/images/${i}.jpg`,
    region: 'Wellington', // Added missing region field
  }));
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('Property Pagination Issue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should maintain pagination when switching suburbs back and forth', async () => {
    const aroValleyPage0 = createMockProperties(9, 'Aro Valley');
    const aroValleyPage1 = createMockProperties(9, 'Aro Valley');
    const brooklynPage0 = createMockProperties(9, 'Brooklyn');

    mockFetchPropertiesByCity
      .mockResolvedValueOnce(aroValleyPage0)
      .mockResolvedValueOnce(aroValleyPage1)
      .mockResolvedValueOnce(brooklynPage0)
      .mockResolvedValueOnce(aroValleyPage0)
      .mockResolvedValueOnce(aroValleyPage1);

    const { result, rerender } = renderHook(
      ({ suburbs }) => usePropertiesData('Wellington City', suburbs),
      {
        wrapper: createWrapper(),
        initialProps: { suburbs: ['Aro Valley'] },
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(true);

    rerender({ suburbs: ['Brooklyn'] });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);

    rerender({ suburbs: ['Aro Valley'] });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(true);
  });

  it('should correctly determine hasNextPage based on page size', async () => {
    const fullPage = createMockProperties(9, 'Aro Valley');
    const partialPage = createMockProperties(5, 'Aro Valley');

    mockFetchPropertiesByCity
      .mockResolvedValueOnce(fullPage)
      .mockResolvedValueOnce(partialPage);

    const { result } = renderHook(
      () => usePropertiesData('Wellington City', ['Aro Valley']),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.hasNextPage).toBe(true);

    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    expect(result.current.hasNextPage).toBe(false);
  });

  it('should reset pagination when query key changes', async () => {
    const aroValleyPage0 = createMockProperties(9, 'Aro Valley');
    const aroValleyPage1 = createMockProperties(9, 'Aro Valley');
    const brooklynPage0 = createMockProperties(9, 'Brooklyn');

    mockFetchPropertiesByCity
      .mockResolvedValueOnce(aroValleyPage0)
      .mockResolvedValueOnce(aroValleyPage1)
      .mockResolvedValueOnce(brooklynPage0);

    const { result, rerender } = renderHook(
      ({ suburbs }) => usePropertiesData('Wellington City', suburbs),
      {
        wrapper: createWrapper(),
        initialProps: { suburbs: ['Aro Valley'] },
      }
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    result.current.fetchNextPage();
    await waitFor(() => expect(result.current.data?.pages).toHaveLength(2));
    
    rerender({ suburbs: ['Brooklyn'] });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    
    expect(result.current.data?.pages).toHaveLength(1);
    expect(result.current.data?.pages[0]).toEqual(brooklynPage0);
  });
});
