import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getCards } from '../helpers/apis';
import { ICardState } from '../types';

const initialState: ICardState = {
  cards: [],
  selectedCard: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalCount: 0,
    count: 0
  },
  rateLimit: {
    limit: 0,
    remaining: 0
  },
  searchFilter: '',
  status: 'idle',
  error: null
};

// Async thunks
export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async ({ page, pageSize, name }: { page: number; pageSize: number; name?: string }) => {
    const response = await getCards(page, pageSize, name);
    return response;
  }
);

const cardSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.searchFilter = action.payload;
    },
    clearSelectedCard: (state) => {
      state.selectedCard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchCards
      .addCase(fetchCards.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.cards = action.payload.cards;
        state.pagination = {
          currentPage: action.payload.pagination.currentPage,
          pageSize: action.payload.pagination.pageSize,
          totalCount: parseInt(action.payload.pagination.totalCount || '0'),
          count: parseInt(action.payload.pagination.count || '0')
        };
        state.rateLimit = {
          limit: parseInt(action.payload.rateLimit.limit || '0'),
          remaining: parseInt(action.payload.rateLimit.remaining || '0')
        };
        state.error = null;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch cards';
      })
  }
});

export const { setSearchFilter, clearSelectedCard } = cardSlice.actions;

export default cardSlice.reducer; 