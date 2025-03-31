'use client'
import React, { useEffect } from 'react';
import { useDebounce } from './hooks/useDebounce';
import CardItem from './components/CardItem';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchCards, setSearchFilter } from './store/cardSlice';
import { ICard } from './types';

const ListCards = () => {
  const dispatch = useAppDispatch();
  const { cards, pagination, rateLimit, searchFilter, status, error } = useAppSelector(state => state.cards);
  const debouncedSearchFilter = useDebounce(searchFilter, 500);

  useEffect(() => {
    if (debouncedSearchFilter) {
      dispatch(fetchCards({ page: 1, pageSize: 10, name: debouncedSearchFilter }));
    } else {
      dispatch(fetchCards({ page: 1, pageSize: 10 }));
    }
  }, [debouncedSearchFilter]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchFilter(e.target.value));
  };

  const handlePrevPage = () => {
    dispatch(fetchCards({ 
      page: pagination.currentPage - 1, 
      pageSize: pagination.pageSize,
      name: searchFilter || undefined 
    }));
  };

  const handleNextPage = () => {
    dispatch(fetchCards({ 
      page: pagination.currentPage + 1, 
      pageSize: pagination.pageSize,
      name: searchFilter || undefined 
    }));
  };

  if (status === 'loading' && cards.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Loading Cards...</h1>
        <p className="text-gray-600">Please wait while we fetch the cards.</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Error</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          <p>{error || 'An error occurred while fetching cards'}</p>
        </div>
        <button 
          onClick={() => dispatch(fetchCards({ page: 1, pageSize: 10 }))}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Magic: The Gathering Cards</h1>
      
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search cards by name..."
          value={searchFilter}
          onChange={handleSearchChange}
          className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
        />
      </div>

      <div className="mb-6 flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
        <p>Total Cards: <span className="font-semibold">{pagination.totalCount}</span></p>
        <p>Current Page: <span className="font-semibold">{pagination.currentPage}</span></p>
        <p>API Rate Limit: <span className="font-semibold">{rateLimit.remaining}/{rateLimit.limit}</span></p>
      </div>

      {status === 'loading' && cards.length > 0 && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded-lg">
          <p>Loading...</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card: ICard) => (
          <CardItem key={card.id} card={card} />
        ))}
      </div>
      <div className="mt-12 flex justify-center gap-4 items-center">
        <button
          onClick={handlePrevPage}
          disabled={pagination.currentPage <= 1 || status === 'loading'}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-medium"
        >
          Previous
        </button>
        <span className="text-gray-600 font-medium">
          Page {pagination.currentPage} of {Math.ceil(pagination.totalCount / pagination.pageSize)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={pagination.currentPage * pagination.pageSize >= pagination.totalCount || status === 'loading'}
          className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors font-medium"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListCards; 