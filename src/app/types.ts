export interface ICard {
    id: string;
    name: string;
    type: string;
    imageUrl?: string;
    text?: string;
    flavor?: string;
    artist?: string;
    setName?: string;
    rarity?: string;
    colors?: string[];
    manaCost?: string;
  }
  
  export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    count: number;
  }
  
  export interface IRateLimit {
    limit: number;
    remaining: number;
  }
  
  export interface ICardState {
    cards: ICard[];
    selectedCard: ICard | null;
    pagination: IPagination;
    rateLimit: IRateLimit;
    searchFilter: string;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
  