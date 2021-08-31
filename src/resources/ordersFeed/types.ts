import { Price, ProductId, Size } from '../api/Cryptofacilities';

export type ErrorCallback = ((event: Event) => void) | null;

export type PriceSizeMap = Map<number, number>;
export type OrdersMaps = {
  asks: PriceSizeMap
  bids: PriceSizeMap
};

export type GroupingFactorXBT = 0.5 | 1 | 2.5;
export type GroupingFactorETH = 0.5 | 0.1 | 0.25;
export type GroupingFactor = GroupingFactorXBT | GroupingFactorETH;

type TotalSize = number;
export type Order = [Price, Size, TotalSize];
export type Orders = Order[];

export type InternalState = {
  errorCallback: ((message: string) => void) | null
  feedSocket: WebSocket | null
  groupedData: OrdersMaps
  groupingFactor: GroupingFactor
  hasError: boolean
  onSnapshotReceived: SnapshotReceivedCallback,
  originalData: OrdersMaps
  productId: ProductId
  subscribed: boolean
};

export type State = {
  asks: Orders,
  bids: Orders,
  groupingFactor: GroupingFactor
  hasError: boolean
  productId: ProductId
  subscribed: boolean
};
export type StateQuery = (callback: StateResponseCallback) => void;
export type StateResponseCallback = (state: State) => void;

export type SnapshotReceivedCallback = ((state: State) => void) | null;

export type OrdersFeed = {
  kill: () => void
  setErrorCallback: (onError: InternalState['errorCallback']) => void
  setGroupingFactor: (factor: GroupingFactor) => void
  subscribe: (product: ProductId, onSnapshotReceived?: SnapshotReceivedCallback) => void
  terminate: () => void
  unsubscribe: () => void
  queryState: (responseCallback: (state :State) => void) => void
};
