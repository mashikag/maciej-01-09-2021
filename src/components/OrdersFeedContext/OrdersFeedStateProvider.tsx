import { proxy } from 'comlink';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from 'react';
import { useIntervalCallback } from 'hooks';
import { ProductId } from 'resources/api/Cryptofacilities';
import { DEFAULT_GROUPING_FACTOR } from 'resources/ordersFeed/constants';
import { GroupingFactor, Orders, State as OrdersFeedWorkerState } from 'resources/ordersFeed/types';
import { OrdersFeedHandle } from './types';

const QUERY_FEED_STATE_INTERVAL = 1000;

export type OrdersFeedData = {
  asks: Orders
  bids: Orders
};

export type OrdersFeedMetadata = {
  groupingFactor: GroupingFactor
  hasError: boolean
  productId: ProductId
  subscribed: boolean
};

export type OrdersFeedState = {
  orders: OrdersFeedData
  metadata: OrdersFeedMetadata
};

export const OrdersFeedStateContext = createContext< OrdersFeedState | undefined>(undefined);

type OrdersFeedDataProviderProps = {
  ordersFeedHandle: OrdersFeedHandle
  children?: ReactNode
};

export const OrdersFeedStateProvider = (
  { ordersFeedHandle: feed, children }: OrdersFeedDataProviderProps,
) => {
  const [orders, setOrders] = useState<OrdersFeedData>({ asks: [], bids: [] });
  const [metadata, setMetadata] = useState<OrdersFeedMetadata>({
    hasError: false,
    groupingFactor: DEFAULT_GROUPING_FACTOR,
    subscribed: false,
    productId: ProductId.None,
  });

  const onFeedState = proxy(
    ({
      asks, bids, hasError, groupingFactor, subscribed, productId,
    }: OrdersFeedWorkerState) => {
      setOrders({ asks, bids });
      setMetadata({
        hasError, groupingFactor, subscribed, productId,
      });
    },
  );

  useIntervalCallback(
    () => { feed.current.queryState(onFeedState); },
    QUERY_FEED_STATE_INTERVAL,
  );

  return (
    <OrdersFeedStateContext.Provider
      value={{ orders, metadata }}
    >
      {children}
    </OrdersFeedStateContext.Provider>
  );
};

export const useOrdersFeedState = () => {
  const context = useContext(OrdersFeedStateContext);
  if (!context) throw new Error('useOrdersFeedData must be used within a OrdersProvider');
  return context;
};
