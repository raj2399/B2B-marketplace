'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'televisions', name: 'Televisions' },
  { id: 'running-shoes', name: 'Running Shoes' }
];

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    setQuery(searchParams?.get('q') || '');
    setCategory(searchParams?.get('category') || 'all');
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, mounted]);

  useEffect(() => {
    if (!mounted) return;

    if (debouncedQuery !== searchParams?.get('q')) {
      const current = new URLSearchParams(searchParams);
      
      if (debouncedQuery) {
        current.set('q', debouncedQuery);
      } else {
        current.delete('q');
      }

      if (category && category !== 'all') {
        current.set('category', category);
      } else {
        current.delete('category');
      }
      
      router.push(`/search?${current.toString()}`);
    }
  }, [debouncedQuery, category, router, searchParams, mounted]);

  const handleCategoryChange = (e) => {
    if (!mounted) return;

    const newCategory = e.target.value;
    setCategory(newCategory);
    
    const current = new URLSearchParams(searchParams);
    
    if (query) {
      current.set('q', query);
    } else {
      current.delete('q');
    }

    if (newCategory && newCategory !== 'all') {
      current.set('category', newCategory);
    } else {
      current.delete('category');
    }
    
    router.push(`/search?${current.toString()}`);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="relative">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        <select
          value={category}
          onChange={handleCategoryChange}
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Search
        </button>
      </div>
    </form>
  );
} 