'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import LoadingSkeletons from '../components/LoadingSkeletons';


const SearchBar = dynamic(() => import('../components/SearchBar'), {
  loading: () => <div className="h-12 bg-gray-100 rounded animate-pulse" />
});

const FilterPanel = dynamic(() => import('../components/FilterPanel'), {
  loading: () => <div className="h-96 bg-gray-100 rounded animate-pulse" />
});

const ProductList = dynamic(() => import('../components/ProductList'), {
  loading: () => <LoadingSkeletons />
});

export default function SearchPageClient() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar />
      </div>
      
      <div className="flex gap-8">
        <div className="w-1/4">
          <FilterPanel />
        </div>
        
        <div className="w-3/4">
          <ProductList />
        </div>
      </div>
    </div>
  );
} 