import {
  FeedEventData,
  FeedResponseEvent,
  FEED_URL,
  getUnsubscribeMessage,
  isFeedEvent,
  isFeedDelta,
  isFeedSnapshot,
  FeedDeltaData, FeedSnapshotData,
  ProductId,
  toSubscribeMessage,
} from 'resources/api/Cryptofacilities';
import { DEFAULT_GROUPING_FACTOR, NORMAL_CLOSURE_CODE } from './constants';
import {
  OrdersFeed,
  GroupingFactor,
  StateQuery,
  Orders,
  SnapshotReceivedCallback,
  State,
  InternalState,
} from './types';
import {
  applySnapshotOrders,
  recomputeGroupedPriceSizeMap,
  toAskOrdersWithTotal,
  toBidOrdersWithTotal,
  updatePriceSizeMaps,
} from './utils';

const defaultInternalState = (): InternalState => ({
  feedSocket: null,
  errorCallback: null,
  originalData: { asks: new Map(), bids: new Map() },
  groupedData: { asks: new Map(), bids: new Map() },
  groupingFactor: DEFAULT_GROUPING_FACTOR,
  productId: ProductId.None,
  subscribed: false,
  hasError: false,
  onSnapshotReceived: null,
});

const internalState: InternalState = defaultInternalState();

let asksOrderedWithTotals: Orders = [];
let bidsOrderedWithTotals: Orders = [];

// to be used with tests only
export const clean = () => {
  Object.assign(internalState, defaultInternalState());
  asksOrderedWithTotals = [];
  bidsOrderedWithTotals = [];
};

const getState = (): State => {
  const {
    hasError, groupingFactor, productId, subscribed,
  } = internalState;
  return {
    asks: asksOrderedWithTotals,
    bids: bidsOrderedWithTotals,
    groupingFactor,
    hasError,
    subscribed,
    productId,
  };
};

const clearOrdersData = () => {
  const { originalData, groupedData } = internalState;
  originalData.asks.clear();
  originalData.bids.clear();
  groupedData.asks.clear();
  groupedData.bids.clear();
};

const resetFeedsMetadata = (productId: ProductId, groupingFactor: GroupingFactor) => {
  internalState.groupingFactor = groupingFactor;
  internalState.productId = productId;
};

const handleFeedSnapshot = ({ asks, bids }: FeedSnapshotData) => {
  const {
    originalData, groupedData, groupingFactor, onSnapshotReceived,
  } = internalState;
  applySnapshotOrders(asks, originalData.asks, groupedData.asks, groupingFactor);
  applySnapshotOrders(bids, originalData.bids, groupedData.bids, groupingFactor);
  asksOrderedWithTotals = toAskOrdersWithTotal(groupedData.asks);
  bidsOrderedWithTotals = toBidOrdersWithTotal(groupedData.bids);
  onSnapshotReceived?.(getState());
  internalState.onSnapshotReceived = null;
};

const handleOrdersBookDelta = ({ asks, bids }: FeedDeltaData) => {
  const { originalData, groupedData, groupingFactor } = internalState;
  if (asks.length > 0) {
    updatePriceSizeMaps(asks, originalData.asks, groupedData.asks, groupingFactor);
  }
  if (bids.length > 0) {
    updatePriceSizeMaps(bids, originalData.bids, groupedData.bids, groupingFactor);
  }
  if (asks.length > 0 || bids.length > 0) {
    asksOrderedWithTotals = toAskOrdersWithTotal(groupedData.asks);
    bidsOrderedWithTotals = toBidOrdersWithTotal(groupedData.bids);
  }
};

const handleFeedEvent = ({ event, product_ids: [productId] }: FeedEventData) => {
  const { productId: currentProduct } = internalState;
  switch (event) {
    case FeedResponseEvent.Subscribed:
      clearOrdersData();
      if (currentProduct !== productId) {
        resetFeedsMetadata(productId, DEFAULT_GROUPING_FACTOR);
      }
      internalState.subscribed = true;
      return;
    case FeedResponseEvent.Unsubscribed:
      if (currentProduct === productId) {
        internalState.subscribed = false;
      }
      return;
    default:
      throw new Error(`Unexpected feed event of ${event}`);
  }
};

const onMessage: WebSocket['onmessage'] = (event) => {
  const data = JSON.parse(event.data);

  if (isFeedEvent(data)) {
    handleFeedEvent(data);
    return;
  }

  if (isFeedSnapshot(data)) {
    handleFeedSnapshot(data);
    return;
  }

  if (isFeedDelta(data)) {
    handleOrdersBookDelta(data);
  }
  // otherwise an unexpected message - just ignore it
};

const onError = () => {
  internalState.hasError = true;
  internalState.errorCallback?.('Jesus! You just broke it!');
};

const connect = () => {
  const { feedSocket } = internalState;
  if (feedSocket && feedSocket.readyState === WebSocket.OPEN) {
    return;
  }
  internalState.hasError = false;
  internalState.feedSocket = new WebSocket(FEED_URL);
  internalState.feedSocket.onerror = onError;
  internalState.feedSocket.onmessage = onMessage;
};

const unsubscribe = () => {
  const { productId: currentProduct, feedSocket: feed } = internalState;
  if (!feed || currentProduct === ProductId.None) {
    return;
  }
  feed.send(getUnsubscribeMessage(currentProduct));
};

const subscribe = (productId: ProductId, onSnapshotReceived?: SnapshotReceivedCallback) => {
  if (productId === ProductId.None) {
    throw new Error(`Cannot subscribe to product ${ProductId.None}`);
  }

  const sendSubscribeMessage = () => {
    const { feedSocket } = internalState;
    if (!feedSocket) return;
    internalState.onSnapshotReceived = onSnapshotReceived ?? null;
    feedSocket.send(toSubscribeMessage(productId));
  };

  connect();
  clearOrdersData();
  const { feedSocket } = internalState;
  if (feedSocket?.readyState === WebSocket.CONNECTING) {
    feedSocket.onopen = sendSubscribeMessage;
  } else {
    unsubscribe();
    sendSubscribeMessage();
  }
};

const terminate = () => {
  unsubscribe();
  internalState.feedSocket?.close(NORMAL_CLOSURE_CODE);
};

const setErrorCallback = (callback: InternalState['errorCallback']) => {
  if (!callback) return;
  // it's important the below callback is wrapped otherwise it loses its context and fails
  internalState.errorCallback = (message: string) => callback(message);
};

const setGroupingFactor = (factor: GroupingFactor) => {
  const { groupedData, originalData } = internalState;
  recomputeGroupedPriceSizeMap(groupedData.asks, originalData.asks, factor);
  recomputeGroupedPriceSizeMap(groupedData.bids, originalData.bids, factor);
  asksOrderedWithTotals = toAskOrdersWithTotal(groupedData.asks);
  bidsOrderedWithTotals = toBidOrdersWithTotal(groupedData.bids);
  internalState.groupingFactor = factor;
};

const queryState: StateQuery = (callback) => {
  callback(getState());
};

const kill = () => {
  const { feedSocket } = internalState;
  if (!feedSocket || feedSocket.readyState !== WebSocket.OPEN) {
    return;
  }
  onError();
  terminate();
};

const ordersFeed: OrdersFeed = {
  kill,
  subscribe,
  setErrorCallback,
  setGroupingFactor,
  terminate,
  unsubscribe,
  queryState,
};

export default ordersFeed;
