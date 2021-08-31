import {
  FeedDeltaData,
  FeedEventData,
  FeedResponseEvent,
  FeedSnapshotData,
  BOOK_FEED_NAME,
  FEED_URL,
  ProductId,
  BOOK_SNAPSHOT_FEED_NAME,
  toSubscribeMessage,
} from 'resources/api/Cryptofacilities';
import WS from 'jest-websocket-mock';
import feed, { clean as cleanOrdersFeed } from '../ordersFeed';
import { State } from '../types';

const SUBSCRIBED_TO_XBT_MSG = JSON.stringify({
  event: FeedResponseEvent.Subscribed,
  feed: BOOK_FEED_NAME,
  product_ids: [ProductId.BitcoinUSD],
} as FeedEventData);

const XBT_SNAPSHOT_MSG = JSON.stringify({
  numLevels: 5,
  feed: BOOK_SNAPSHOT_FEED_NAME,
  product_id: ProductId.BitcoinUSD,
  asks: [[1, 5], [0.7, 10], [3.2, 3], [3.5, 2], [3, 1]],
  bids: [[3.4, 5], [2.1, 3], [7, 10], [2.15, 2], [1.99, 1]],
} as FeedSnapshotData);

const XBT_DELTA_MSG = JSON.stringify({
  feed: BOOK_FEED_NAME,
  product_id: ProductId.BitcoinUSD,
  asks: [[0.7, 0], [3.1, 8], [3.5, 0]],
  bids: [[2, 3], [2.15, 0]],
} as FeedDeltaData);

describe('Test orders feed', () => {
  let server: WS;

  beforeEach(() => {
    WS.clean();
    cleanOrdersFeed();
    server = new WS(FEED_URL);
  });

  it('Should throw an error when attempting to subscribe to none', () => {
    expect(() => {
      feed.subscribe(ProductId.None);
    }).toThrowError(`Cannot subscribe to product ${ProductId.None}`);
  });

  it('Should connect to mock server at feed url on subscribe', async () => {
    feed.subscribe(ProductId.BitcoinUSD);
    expect(await server.connected).toBeTruthy();
  });

  it('Should have the expected state after snapshot data is received after subscribe call', async () => {
    const expectedState: State = {
      asks: [[0.5, 10, 10], [1, 5, 15], [3, 4, 19], [3.5, 2, 21]],
      bids: [[7, 10, 10], [3, 5, 15], [2, 5, 20], [1.5, 1, 21]],
      subscribed: true,
      productId: ProductId.BitcoinUSD,
      groupingFactor: 0.5,
      hasError: false,
    };
    feed.subscribe(ProductId.BitcoinUSD);
    await server.connected;
    await server.nextMessage;
    expect(server).toHaveReceivedMessages([toSubscribeMessage(ProductId.BitcoinUSD)]);
    server.send(SUBSCRIBED_TO_XBT_MSG);
    server.send(XBT_SNAPSHOT_MSG);
    feed.queryState((state) => {
      expect(state).toEqual(expectedState);
    });
  });

  it('Should have the expected state after orders delta is received', async () => {
    const expectedState: State = {
      asks: [[1, 5, 5], [3, 12, 17]],
      bids: [[7, 10, 10], [3, 5, 15], [2, 6, 21], [1.5, 1, 22]],
      subscribed: true,
      productId: ProductId.BitcoinUSD,
      groupingFactor: 0.5,
      hasError: false,
    };
    feed.subscribe(ProductId.BitcoinUSD);
    await server.connected;
    await server.nextMessage;
    server.send(SUBSCRIBED_TO_XBT_MSG);
    server.send(XBT_SNAPSHOT_MSG);
    server.send(XBT_DELTA_MSG);
    feed.queryState((state) => {
      expect(state).toEqual(expectedState);
    });
  });

  it('Should have the expected state after snapshot data is received and then grouping factor is changed', async () => {
    const expectedState: State = {
      asks: [[2.5, 6, 6]],
      bids: [[5, 10, 10], [2.5, 5, 15]],
      subscribed: true,
      productId: ProductId.BitcoinUSD,
      groupingFactor: 2.5,
      hasError: false,
    };
    feed.subscribe(ProductId.BitcoinUSD);
    await server.connected;
    await server.nextMessage;
    expect(server).toHaveReceivedMessages([toSubscribeMessage(ProductId.BitcoinUSD)]);
    server.send(SUBSCRIBED_TO_XBT_MSG);
    server.send(XBT_SNAPSHOT_MSG);
    feed.setGroupingFactor(2.5);
    feed.queryState((state) => {
      expect(state).toEqual(expectedState);
    });
  });
});
