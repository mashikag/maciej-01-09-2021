import { act, render } from '@testing-library/react';
import { useContext, useEffect } from 'react';
import { ProductId } from 'resources/api/Cryptofacilities';
import { OrdersFeedState, OrdersFeedStateContext, OrdersFeedStateProvider } from '..';
import { OrdersFeedHandle } from '../types';

const ONE_SECOND = 1000;
const queryFeedState = jest.fn();
const ordersFeedHandle = {
  current: {
    queryState: queryFeedState,
  },
} as unknown as OrdersFeedHandle;

beforeEach(() => {
  queryFeedState.mockReset();
});

type OrdersFeedStateContextTesterProps = {
  onContextChange: (ctxt?: OrdersFeedState) => void
};

const OrdersFeedStateContextTester = ({ onContextChange }: OrdersFeedStateContextTesterProps) => {
  const feedStateContext = useContext(OrdersFeedStateContext);
  useEffect(() => {
    onContextChange(feedStateContext);
  }, [feedStateContext]);
  return null;
};

describe('Test OrdersFeedStateProvider component', () => {
  it('Should query orders feed\'s state every second ', () => {
    jest.useFakeTimers();
    render(<OrdersFeedStateProvider ordersFeedHandle={ordersFeedHandle} />);
    expect(queryFeedState).not.toBeCalled();
    jest.advanceTimersByTime(ONE_SECOND);
    expect(queryFeedState).toBeCalledTimes(1);
    jest.advanceTimersByTime(10 * ONE_SECOND);
    expect(queryFeedState).toBeCalledTimes(11);
  });

  it('Should expose orders feed\'s state once state query is resolved', async () => {
    jest.useFakeTimers();
    const ctxtChanged = jest.fn();
    const feedState = {
      asks: [[3, 2, 2]],
      bids: [[1, 2, 2]],
      groupingFactor: 2.5,
      hasError: true,
      productId: ProductId.BitcoinUSD,
      subscribed: true,
    };
    const expectedCtxtValue = {
      orders: {
        asks: [[3, 2, 2]],
        bids: [[1, 2, 2]],
      },
      metadata: {
        groupingFactor: 2.5,
        hasError: true,
        productId: ProductId.BitcoinUSD,
        subscribed: true,
      },
    };
    queryFeedState.mockImplementation((callback: Function) => callback(feedState));
    render(
      <OrdersFeedStateProvider ordersFeedHandle={ordersFeedHandle}>
        <OrdersFeedStateContextTester onContextChange={ctxtChanged} />
      </OrdersFeedStateProvider>,
    );
    act(() => { jest.advanceTimersByTime(ONE_SECOND); });
    expect(ctxtChanged).lastCalledWith(expectedCtxtValue);
  });
});
