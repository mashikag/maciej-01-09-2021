import { screen } from '@testing-library/react';
import { feedState, feedStateMetadata, render } from 'utils/testUtils';
import { ProductId } from 'resources/api/Cryptofacilities';
import { OrdersFeedState } from 'components/OrdersFeedContext';
import App from '../App';

describe('Test app', () => {
  it('Should render loading state when waiting for data', () => {
    render(<App />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    expect(screen.getByText('Spread will apear here')).toBeInTheDocument();
  });

  it('Should not render loading state when has data to display', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[1, 1, 1], [2, 2, 3]],
        bids: [[0.5, 1, 1]],
      },
    });
    render(<App />, { feedStateCtxt });
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
    expect(screen.queryByText('Spread will apear here')).not.toBeInTheDocument();
  });

  it('Should render enbaled select market button with the currently selected market', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[1, 1, 1], [2, 2, 3]],
        bids: [],
      },
      metadata: feedStateMetadata({ productId: ProductId.EthereumUSD }),
    });
    render(<App />, { feedStateCtxt });
    expect(screen.getByRole('button', { name: 'Market: ETH/USD' })).toBeEnabled();
  });

  it('Should render enbaled select group button with the currently selected price grouping', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[1, 1, 1], [2, 2, 3]],
        bids: [],
      },
      metadata: feedStateMetadata({
        productId: ProductId.EthereumUSD,
        groupingFactor: 0.1,
      }),
    });
    render(<App />, { feedStateCtxt });
    expect(screen.getByRole('button', { name: 'Group: 0.10' })).toBeEnabled();
  });

  it('Should render asks and bids table', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[1, 1, 1], [2, 2, 3]],
        bids: [],
      },
      metadata: feedStateMetadata({
        productId: ProductId.EthereumUSD,
        groupingFactor: 0.5,
      }),
    });
    render(<App />, { feedStateCtxt });
    expect(screen.getAllByRole('table', { name: 'Orders table' })).toHaveLength(2);
  });

  it('Should render kill feed button', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[1, 1, 1], [2, 2, 3]],
        bids: [],
      },
      metadata: feedStateMetadata({
        productId: ProductId.EthereumUSD,
        groupingFactor: 0.5,
      }),
    });
    render(<App />, { feedStateCtxt });
    expect(screen.getByRole('button', { name: 'Kill feed' })).toBeEnabled();
  });

  it('Should render spread with the expected value', () => {
    const feedStateCtxt: OrdersFeedState = feedState({
      orders: {
        asks: [[12, 5, 10], [15, 5, 5]],
        bids: [[10, 10, 20], [5, 10, 10]],
      },
    });
    render(<App />, { feedStateCtxt });
    expect(screen.getByText('Spread: $2.00 (20.00%)')).toBeInTheDocument();
  });
});
