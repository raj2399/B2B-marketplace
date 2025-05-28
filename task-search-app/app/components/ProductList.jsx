'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ProductList() {
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchResults = useCallback(async () => {
    if (!isClient) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const url = searchParams.toString() 
        ? `/api/search?${searchParams.toString()}`
        : '/api/search';

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setError('Failed to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [searchParams, isClient]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  if (!isClient) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-red-600">Error</h3>
        <p className="text-gray-500 mt-2">{error}</p>
      </div>
    );
  }
  
  if (!results || results.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl font-semibold text-gray-600">No results found</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map((product) => (
        <div
          key={product._id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4">
            <div className="mb-2">
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {product.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>
              <div className="text-2xl font-bold text-blue-600 mt-2">
                ${product.price.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-2 mt-4 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-medium">{product.categoryId.name}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{product.location}</span>
              </div>

              {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 