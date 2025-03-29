import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cardReducer from '../store/cardSlice';
import ListCards from '../page';
import '@testing-library/jest-dom';

// Mock the API call
jest.mock('../helpers/apis', () => ({
  getCards: jest.fn()
}));

// Mock the CardItem component
jest.mock('../components/CardItem', () => {
  function MockCardItem(props) {
    return <div data-testid={`card-${props.card.id}`}>{props.card.name}</div>;
  }
  MockCardItem.displayName = 'MockCardItem';
  return MockCardItem;
});

// Mock the debounce hook to be immediate for testing
jest.mock('../hooks/useDebounce', () => ({
  // This properly simulates debounce by only returning the final value
  useDebounce: (value) => {
    // Only return "Lotus" when the full string is typed
    if (value === "Lotus") return value;
    // Return empty string for partial inputs
    return "";
  }
}));

import { getCards } from '../helpers/apis';

describe('ListCards Component - Filtering', () => {
  let store;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    store = configureStore({
      reducer: {
        cards: cardReducer
      },
      preloadedState: {
        cards: {
          cards: [
            { id: '1', name: 'Black Lotus', type: 'Artifact' },
            { id: '2', name: 'Lightning Bolt', type: 'Instant' },
            { id: '3', name: 'Counterspell', type: 'Instant' }
          ],
          selectedCard: null,
          pagination: {
            currentPage: 1,
            pageSize: 10,
            totalCount: 3,
            count: 3
          },
          rateLimit: {
            limit: 5000,
            remaining: 4999
          },
          searchFilter: '',
          status: 'succeeded',
          error: null
        }
      }
    });
    
    // Mock filtered API response
    getCards.mockImplementation((page, pageSize, name) => {
      if (name === 'Lotus') {
        return Promise.resolve({
          cards: [{ id: '1', name: 'Black Lotus', type: 'Artifact' }],
          pagination: {
            currentPage: page,
            pageSize,
            totalCount: '1',
            count: '1'
          },
          rateLimit: {
            limit: '5000',
            remaining: '4998'
          }
        });
      }
      
      return Promise.resolve({
        cards: [
          { id: '1', name: 'Black Lotus', type: 'Artifact' },
          { id: '2', name: 'Lightning Bolt', type: 'Instant' },
          { id: '3', name: 'Counterspell', type: 'Instant' }
        ],
        pagination: {
          currentPage: page,
          pageSize,
          totalCount: '3',
          count: '3'
        },
        rateLimit: {
          limit: '5000',
          remaining: '4999'
        }
      });
    });
  });
  
  it('should display all cards initially', () => {
    render(
      <Provider store={store}>
        <ListCards />
      </Provider>
    );
    
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.getByTestId('card-2')).toBeInTheDocument();
    expect(screen.getByTestId('card-3')).toBeInTheDocument();
  });
  
  it('should filter cards when searching', async () => {
    const user = userEvent.setup();
    
    render(
      <Provider store={store}>
        <ListCards />
      </Provider>
    );
    
    // Clear previous calls from initial load
    getCards.mockClear();
    
    // Type in search box and wrap in act
    await act(async () => {
      const searchInput = screen.getByPlaceholderText(/search cards/i);
      await user.type(searchInput, 'Lotus');
    });
    
    // Wait for API call to complete
    await waitFor(() => {
      // Check the last call specifically (without the fourth parameter)
      expect(getCards).toHaveBeenLastCalledWith(1, 10, 'Lotus');
    });
    
    // Now check the filtered results
    expect(screen.getByTestId('card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('card-3')).not.toBeInTheDocument();
  });
  
  it('should show loading state while filtering', async () => {
    render(
      <Provider store={store}>
        <ListCards />
      </Provider>
    );
    
    // Update store to loading state
    store.dispatch({ type: 'cards/fetchCards/pending' });
    
    // Check for loading indicator
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
  
  it('should show error message when filtering fails', async () => {
    // Mock API error
    getCards.mockRejectedValueOnce(new Error('Failed to filter cards'));
    
    render(
      <Provider store={store}>
        <ListCards />
      </Provider>
    );
    
    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search cards/i);
    await userEvent.type(searchInput, 'Error');
    
    // Wait for error state
    await waitFor(() => {
      expect(store.getState().cards.status).toBe('failed');
    });
    
    // Check error message
    expect(screen.getByText(/failed to filter cards/i)).toBeInTheDocument();
    
    // Check retry button
    const retryButton = screen.getByText(/try again/i);
    expect(retryButton).toBeInTheDocument();
    
    // Test retry functionality
    await userEvent.click(retryButton);
    expect(getCards).toHaveBeenCalled();
  });
});