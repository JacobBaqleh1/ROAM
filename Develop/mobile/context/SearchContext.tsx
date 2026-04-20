import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  parks: any[];
  query: string;
  setSearchResults: (parks: any[], query: string) => void;
  getParkById: (id: string) => any | null;
}

const SearchContext = createContext<SearchContextType>({
  parks: [],
  query: '',
  setSearchResults: () => {},
  getParkById: () => null,
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [parks, setParks] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [parkMap, setParkMap] = useState<Record<string, any>>({});

  const setSearchResults = (newParks: any[], newQuery: string) => {
    setParks(newParks);
    setQuery(newQuery);
    const map: Record<string, any> = {};
    for (const p of newParks) {
      if (p.id) map[String(p.id)] = p;
    }
    setParkMap(map);
  };

  const getParkById = (id: string) => parkMap[String(id)] ?? null;

  return (
    <SearchContext.Provider value={{ parks, query, setSearchResults, getParkById }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
