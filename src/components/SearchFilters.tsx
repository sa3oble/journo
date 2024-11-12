'use client';

import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchFiltersProps {
  onSearch: (keyword: string) => void;
}

export function SearchFilters({ onSearch }: SearchFiltersProps) {
  const [keyword, setKeyword] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setKeyword(value);
    onSearch(value);
  };

  const handleClear = () => {
    setKeyword('');
    onSearch('');
  };

  return (
    <div className="mb-8">
      <div className="max-w-2xl mx-auto">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={20} />
            <input
              type="text"
              value={keyword}
              onChange={handleChange}
              placeholder="Filter tweets by keyword..."
              className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-gray-100 rounded-xl
                       focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                       shadow-sm transition duration-200 ease-in-out
                       hover:border-gray-200 hover:shadow-md"
              aria-label="Filter tweets by keyword"
            />
            {keyword && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1
                         text-gray-400 hover:text-gray-600 transition-colors
                         hover:bg-gray-100 rounded-full"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
          <p>Type to filter tweets in real-time</p>
          {keyword && (
            <p>Showing tweets containing: <span className="font-medium text-indigo-600">{keyword}</span></p>
          )}
        </div>
      </div>
    </div>
  );
}