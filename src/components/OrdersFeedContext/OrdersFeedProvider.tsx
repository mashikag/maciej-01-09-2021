import { ReactNode, useEffect } from 'react';
import { proxy } from 'comlink';
import { useOrdersFeed } from 'hooks';
import { useErrorNotifier } from 'components/ErrorNotifierProvider';
import { OrdersFeedStateProvider } from './OrdersFeedStateProvider';
import { OrdersFeedCallerProvider } from './OrdersFeedCallerProvider';

type OrdersBookProviderProps = {
  children?: ReactNode,
  ordersFeedWorker: Worker
};

export const OrdersFeedProvider = (
  { children, ordersFeedWorker }: OrdersBookProviderProps,
) => {
  const ordersFeedHandle = useOrdersFeed(ordersFeedWorker);
  const { showError } = useErrorNotifier();
  useEffect(() => {
    ordersFeedHandle.current.setErrorCallback(proxy(showError));
  }, []);
  return (
    <OrdersFeedCallerProvider ordersFeedHandle={ordersFeedHandle}>
      <OrdersFeedStateProvider ordersFeedHandle={ordersFeedHandle}>
        {children}
      </OrdersFeedStateProvider>
    </OrdersFeedCallerProvider>
  );
};
