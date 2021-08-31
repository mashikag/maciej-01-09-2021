export const FEED_URL = 'wss://www.cryptofacilities.com/ws/v1';
export const BOOK_FEED_NAME = 'book_ui_1';
export const BOOK_SNAPSHOT_FEED_NAME = 'book_ui_1_snapshot';

export type Price = number;
export type Size = number;

export enum ProductId {
  EthereumUSD = 'PI_ETHUSD',
  BitcoinUSD = 'PI_XBTUSD',
  None = 'none',
}

export enum FeedRequestEvent {
  Subscribe = 'subscribe',
  Unsubscribe = 'unsubscribe',
}

export enum FeedResponseEvent {
  Subscribed = 'subscribed',
  Unsubscribed = 'unsubscribed',
}

export type FeedEventData = {
  event: FeedResponseEvent,
  feed: typeof BOOK_FEED_NAME,
  product_ids: ProductId[]
};

export type FeedSnapshotData = {
  numLevels: number
  feed: typeof BOOK_SNAPSHOT_FEED_NAME
} & Omit<FeedDeltaData, 'feed'>;

export type FeedDeltaData = {
  asks: [Price, Size][]
  bids: [Price, Size][]
  feed: typeof BOOK_FEED_NAME
  product_id: ProductId
};

export const isFeedSnapshot = (value: any): value is FeedSnapshotData => (
  typeof value === 'object'
    && typeof value.numLevels === 'number'
    && Array.isArray(value.asks)
    && Array.isArray(value.bids)
    && value.feed === BOOK_SNAPSHOT_FEED_NAME
    && Object.values(ProductId).includes(value.product_id)
);

export const isFeedDelta = (value: any): value is FeedDeltaData => (
  typeof value === 'object'
    && Array.isArray(value.asks)
    && Array.isArray(value.bids)
    && value.feed === BOOK_FEED_NAME
    && Object.values(ProductId).includes(value.product_id)
);

export const isFeedEvent = (value: any): value is FeedEventData => (
  typeof value === 'object'
    && Object.values(FeedResponseEvent).includes(value.event)
    && value.feed === BOOK_FEED_NAME
    && Array.isArray(value.product_ids)
);

export const toSubscribeMessage = (productId: ProductId) => JSON.stringify({
  event: FeedRequestEvent.Subscribe,
  feed: BOOK_FEED_NAME,
  product_ids: [productId],
});

export const getUnsubscribeMessage = (productId: ProductId) => JSON.stringify({
  event: FeedRequestEvent.Unsubscribe,
  feed: BOOK_FEED_NAME,
  product_ids: [productId],
});
