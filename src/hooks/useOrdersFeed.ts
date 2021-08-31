import { wrap, releaseProxy } from 'comlink';
import { useEffect, useRef } from 'react';
import { OrdersFeed } from 'resources/ordersFeed/types';

const useOrdersFeed = (worker: Worker) => {
  const ordersFeed = useRef(wrap<OrdersFeed>(worker));
  useEffect(() => () => {
    ordersFeed.current.terminate();
    ordersFeed.current[releaseProxy]();
    worker.terminate();
  }, []);
  return ordersFeed;
};

export default useOrdersFeed;
