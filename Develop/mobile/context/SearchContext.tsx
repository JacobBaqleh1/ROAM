import React, { createContext, useContext, useState } from 'react';

interface SearchContextType {
  parks: any[];
  query: string;
  setSearchResults: (parks: any[], query: string) => void;
}

const SearchContext = createContext<SearchContextType>({
  parks: [],
  query: '',
  setSearchResults: () => {},
});

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [parks, setParks] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  const setSearchResults = (newParks: any[], newQuery: string) => {
    setParks(newParks);
    setQuery(newQuery);
  };

  return (
    <SearchContext.Provider value={{ parks, query, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}
