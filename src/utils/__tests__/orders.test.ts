import { Orders } from 'resources/ordersFeed/types';
import { resolveMaxTotal, resolveSpread, Spread } from 'utils/orders';

describe('Test book orders util', () => {
  it.each<{
    asks: Orders,
    bids: Orders,
    expected: number
  }>([
    {
      asks: [],
      bids: [],
      expected: 0,
    },
    {
      asks: [[0.5, 10, 10], [1, 5, 15], [3, 4, 19], [3.5, 2, 21]],
      bids: [[7, 10, 10], [3, 5, 10], [2, 5, 20], [1.5, 1, 16]],
      expected: 21,
    },
    {
      asks: [[0.5, 10, 10], [1, 5, 15], [3, 4, 19], [3.5, 2, 21]],
      bids: [[7, 10, 10], [3, 5, 15], [2, 5, 25], [1.5, 10, 35]],
      expected: 35,
    },
  ])(
    'Should resolve max total to $expected where asks=$asks and bids=$bids',
    ({ asks, bids, expected }) => {
      expect(resolveMaxTotal(asks, bids)).toBe(expected);
    },
  );

  it.each<{
    asks: Orders,
    bids: Orders,
    expected: Spread | null
  }>([
    {
      asks: [],
      bids: [],
      expected: null,
    },
    {
      asks: [[2, 2, 2]],
      bids: [[2, 2, 2], [1, 1, 3]],
      expected: {
        money: '$0.00',
        percentage: '0.00%',
      },
    },
    {
      asks: [[2.5, 2, 2], [5, 1, 3]],
      bids: [[2, 2, 2], [1, 1, 3]],
      expected: {
        money: '$0.50',
        percentage: '25.00%',
      },
    },
  ])(
    'Shoud resolve spread to $expecetd where asks=$asks and bids=$bids',
    ({ asks, bids, expected }) => {
      expect(resolveSpread(asks, bids)).toEqual(expected);
    },
  );
});
