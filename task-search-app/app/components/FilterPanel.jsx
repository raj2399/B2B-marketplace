'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterPanel() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [facets, setFacets] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchFacets = async () => {
      try {
        const response = await fetch(`/api/search?${searchParams.toString()}`);
        const data = await response.json();
        setFacets(data.facets);
      } catch (error) {
        console.error('Error fetching facets:', error);
      }
    };

    fetchFacets();
  }, [searchParams, mounted]);

  const getCurrentFilters = () => {
    if (!mounted) return {};
    
    try {
      const filtersStr = searchParams.get('filters');
      return filtersStr ? JSON.parse(decodeURIComponent(filtersStr)) : {};
    } catch (e) {
      return {};
    }
  };

  const updateFilters = (name, value) => {
    if (!mounted) return;

    const current = new URLSearchParams(searchParams);
    const currentFilters = getCurrentFilters();
    
    if (currentFilters[name] === value) {
      delete currentFilters[name];
    } else {
      currentFilters[name] = value;
    }

    if (Object.keys(currentFilters).length > 0) {
      current.set('filters', encodeURIComponent(JSON.stringify(currentFilters)));
    } else {
      current.delete('filters');
    }
    
    router.push(`/search?${current.toString()}`);
  };

  if (!mounted || !facets) return null;

  const renderAttributeFilter = (attribute) => {
    if (!attribute?.values?.length) return null;
    const currentFilters = getCurrentFilters();

    return (
      <div key={attribute.name} className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 capitalize">
          {attribute.name.replace(/([A-Z])/g, ' $1').trim()}
        </h3>
        <div className="space-y-2">
          {attribute.values.map((item) => {
            const itemValue = attribute.type === 'number' 
              ? Number(item.value)
              : attribute.type === 'boolean'
                ? Boolean(item.value)
                : String(item.value);

            return (
              <label
                key={`${item.value}`}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={currentFilters[attribute.name] === itemValue}
                  onChange={() => updateFilters(attribute.name, itemValue)}
                  className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                />
                <span className="text-sm">
                  {item.value.toString()} ({item.count})
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {facets.attributes?.map(renderAttributeFilter)}
    </div>
  );
} 