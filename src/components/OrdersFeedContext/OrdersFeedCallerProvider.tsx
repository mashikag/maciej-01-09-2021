import {
  createContext,
  ReactNode,
  useContext,
} from 'react';
import { ProductId } from 'resources/api/Cryptofacilities';
import { GroupingFactor } from 'resources/ordersFeed/types';
import { OrdersFeedHandle } from './types';

export type OrdersFeedCaller = {
  kill: () => void
  groupBy: (groupingFactor: GroupingFactor) => void
  subscribe: (productId: ProductId) => void
  unsubscribe: () => void
};

export const OrdersFeedCallerContext = createContext<OrdersFeedCaller | undefined>(undefined);

type OrdersFeedCallerProps = {
  children?: ReactNode,
  ordersFeedHandle: OrdersFeedHandle
};

export const OrdersFeedCallerProvider = (
  { children, ordersFeedHandle }: OrdersFeedCallerProps,
) => (
  <OrdersFeedCallerContext.Provider value={{
    kill: () => {
      ordersFeedHandle.current.kill();
    },
    groupBy: (groupingFactor) => {
      ordersFeedHandle.current.setGroupingFactor(groupingFactor);
    },
    subscribe: (productId) => {
      ordersFeedHandle.current.subscribe(productId);
    },
    unsubscribe: () => {
      ordersFeedHandle.current.unsubscribe();
    },
  }}
  >
    {children}
  </OrdersFeedCallerContext.Provider>
);

export const useOrdersFeedCaller = () => {
  const context = useContext(OrdersFeedCallerContext);
  if (context === undefined) {
    throw new Error('useOrdersFeedUpdater must be used within a OrdersFeedUpdaterProvider');
  }
  return context;
};
