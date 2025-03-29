import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should update value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );
    
    // Change the value
    rerender({ value: 'Lotus', delay: 500 });
    
    // Value shouldn't change immediately
    expect(result.current).toBe('initial');
    
    // Advance timer by delay amount
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Now value should be updated
    expect(result.current).toBe('Lotus');
  });
});