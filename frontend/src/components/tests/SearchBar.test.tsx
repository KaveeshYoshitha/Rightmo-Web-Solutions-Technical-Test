import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

const mockSearch = jest.fn();

jest.mock('../../store/ProductStore', () => ({
  useProductStore: (selector?: unknown) => {
    const state = {
      search: mockSearch,
    };

    if (typeof selector === 'function') {
      return (selector as (s: typeof state) => unknown)(state);
    }

    return state;
  },
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockSearch.mockClear();
  });

  test('calls search on input change', () => {
    render(<SearchBar />);

    const input = screen.getByPlaceholderText(/search products/i);
    fireEvent.change(input, { target: { value: 'phone' } });

    expect(input).toBeInTheDocument();
    expect(mockSearch).toHaveBeenCalledWith('phone');
  });
});
