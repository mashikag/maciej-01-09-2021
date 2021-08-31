import { Orders } from 'resources/ordersFeed/types';
import { formatNumber } from './number';

export const resolveMaxTotal = (asks: Orders, bids: Orders) => (
  Math.max(
    asks.length ? asks[asks.length - 1][2] : 0,
    bids.length ? bids[bids.length - 1][2] : 0,
  )
);

export type Spread = {
  money: string
  percentage: string
};

export const resolveSpread = (asks: Orders, bids: Orders): Spread | null => {
  if (asks.length === 0 || bids.length === 0) {
    return null;
  }
  const highestBid = bids[0][0];
  const lowestAsk = asks[0][0];
  const moneySpread = lowestAsk - highestBid;
  return {
    money: `$${formatNumber(moneySpread)}`,
    percentage: `${((moneySpread / highestBid) * 100).toFixed(2)}%`,
  };
};
