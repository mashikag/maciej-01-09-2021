import { render as testingLibRender } from '@testing-library/react';
import { ErrorNotifierProvider } from 'components/ErrorNotifierProvider';
import {
  OrdersFeedCaller,
  OrdersFeedCallerContext,
  OrdersFeedData,
  OrdersFeedMetadata,
  OrdersFeedState,
  OrdersFeedStateContext,
} from 'components/OrdersFeedContext';
import { ReactElement, ReactNode } from 'react';
import { ProductId } from 'resources/api/Cryptofacilities';
import { DEFAULT_GROUPING_FACTOR } from 'resources/ordersFeed/constants';
import { ResponsiveSize } from '../constants';

type RenderOptions = {
  feedCallerCtxt: OrdersFeedCaller,
  feedStateCtxt: OrdersFeedState,
};

export const feedCaller = (caller?: Partial<OrdersFeedCaller>): OrdersFeedCaller => ({
  kill: jest.fn(),
  groupBy: jest.fn(),
  subscribe: jest.fn(),
  unsubscribe: jest.fn(),
  ...caller,
});

export const feedStateOrders = (data?: Partial<OrdersFeedData>):OrdersFeedData => ({
  asks: [],
  bids: [],
  ...data,
});

export const feedStateMetadata = (metadata?: Partial<OrdersFeedMetadata>):OrdersFeedMetadata => ({
  groupingFactor: DEFAULT_GROUPING_FACTOR,
  hasError: false,
  productId: ProductId.None,
  subscribed: false,
  ...metadata,
});

export const feedState = (state?: Partial<OrdersFeedState>): OrdersFeedState => ({
  orders: { ...feedStateOrders() },
  metadata: { ...feedStateMetadata() },
  ...state,
});

export const renderOptions = (options?: Partial<RenderOptions>) => ({
  feedCallerCtxt: feedCaller(),
  feedStateCtxt: feedState(),
  ...options,
});

export const render = (
  ui: ReactElement,
  {
    feedCallerCtxt = feedCaller(),
    feedStateCtxt = feedState(),
  }: Partial<RenderOptions> = renderOptions(),
) => {
  const wrapper = ({ children }: { children?: ReactNode }) => (
    <ErrorNotifierProvider>
      <OrdersFeedCallerContext.Provider value={feedCallerCtxt}>
        <OrdersFeedStateContext.Provider value={feedStateCtxt}>
          {children}
        </OrdersFeedStateContext.Provider>
      </OrdersFeedCallerContext.Provider>
    </ErrorNotifierProvider>
  );
  testingLibRender(ui, { wrapper });
};

export const asMock = (obj: any) => (obj as jest.Mock);

export const largeScreen = () => ({
  size: ResponsiveSize.Large,
  isLargeScreen: true,
  isSmallScreen: false,
});

export const smallScreen = () => ({
  size: ResponsiveSize.Small,
  isLargeScreen: false,
  isSmallScreen: true,
});
