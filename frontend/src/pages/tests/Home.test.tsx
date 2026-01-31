import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../Home';
import { api } from '../../services/api';

const mockSetProducts = jest.fn();
const mockSetPage = jest.fn();
const mockSearch = jest.fn();
const mockFilterByCategory = jest.fn();
const mockSortByPrice = jest.fn();
const mockLogout = jest.fn();

jest.mock('../../services/api', () => ({
  api: {
    get: jest.fn(() =>
      Promise.resolve({
        data: [
          {
            id: 1,
            title: 'Product 1',
            price: 50,
            category: 'electronics',
            image: 'img',
            rating: { rate: 4, count: 10 },
            description: 'desc',
          },
        ],
      }),
    ),
  },
}));

jest.mock('../../store/ProductStore', () => ({
  useProductStore: (selector?: unknown) => {
    const state = {
      filteredProducts: [],
      categories: ['electronics'],
      currentPage: 1,
      itemsPerPage: 6,
      setProducts: mockSetProducts,
      setPage: mockSetPage,
      search: mockSearch,
      filterByCategory: mockFilterByCategory,
      sortByPrice: mockSortByPrice,
    };

    if (typeof selector === 'function') {
      return (selector as (s: typeof state) => unknown)(state);
    }

    return state;
  },
}));

jest.mock('../../store/AuthStore', () => ({
  useAuthStore: () => ({
    user: { id: 1, username: 'tester', email: 't@t.com' },
    logout: mockLogout,
  }),
}));

describe('Home Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner initially', () => {
    (api.get as unknown as jest.Mock).mockReturnValueOnce(
      new Promise(() => {
        // keep pending
      }),
    );

    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('fetches and displays products', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    await waitFor(() => expect(mockSetProducts).toHaveBeenCalled());

    expect(screen.getByText(/Product Dashboard/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /add product/i }),
    ).toBeInTheDocument();
  });

  test('opens add product dialog', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>,
    );

    await waitFor(() => expect(mockSetProducts).toHaveBeenCalled());

    fireEvent.click(screen.getByRole('button', { name: /add product/i }));
    expect(
      screen.getByRole('heading', { name: /add product/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });
});
