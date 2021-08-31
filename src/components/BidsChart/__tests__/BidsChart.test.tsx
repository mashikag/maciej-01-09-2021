import { screen } from '@testing-library/react';
import { ORDERS_LIMIT } from 'resources/ordersFeed/constants';
import { Orders } from 'resources/ordersFeed/types';
import { feedState, render } from 'utils/testUtils';
import BidsChart from '..';

// More generic chart tests are covered under OrdersChart.test.tsx
describe('Test BidsChart component', () => {
  it('Should render Price, Size and Total as table headers', () => {
    const expectedHeaders = ['Price', 'Size', 'Total'];
    render(<BidsChart />);
    expectedHeaders.forEach((header) => {
      expect(screen.getByRole('columnheader', { name: header })).toBeInTheDocument();
    });
  });

  it('Should render orders book table with data', () => {
    const bids: Orders = [[15, 15, 15], [10, 10, 25], [5, 5, 30]];
    const feedStateCtxt = feedState({
      orders: { asks: [], bids },
    });
    render(<BidsChart />, { feedStateCtxt });
    expect(screen.getAllByRole('cell', { name: '15.00' })).toHaveLength(3);
    expect(screen.getAllByRole('cell', { name: '10.00' })).toHaveLength(2);
    expect(screen.getAllByRole('cell', { name: '25.00' })).toHaveLength(1);
    expect(screen.getAllByRole('cell', { name: '5.00' })).toHaveLength(2);
    expect(screen.getAllByRole('cell', { name: '30.00' }))
      .toHaveLength(1 + (ORDERS_LIMIT - bids.length));
  });
});
