import { ascending, descending } from 'utils/number';
import { Price, Size } from '../api/Cryptofacilities';
import { ORDERS_LIMIT } from './constants';
import { GroupingFactor, PriceSizeMap } from './types';

const getPriceGroupByFactor = (
  price: number,
  factor: number,
): number => {
  const priceFactorQuotient = price / factor;
  if (priceFactorQuotient < 1) return 0;
  return Math.floor(priceFactorQuotient) * factor;
};

const updatePriceSizeEntry = (map: PriceSizeMap, price: number, size: number) => {
  if (size <= 0) {
    map.delete(price);
  } else {
    map.set(price, size);
  }
};

const updateGroupedPriceSizeEntry = (
  map: PriceSizeMap,
  price: number,
  size: number,
  prevPriceSize: number,
  groupingFactor: number,
) => {
  const priceGroup = getPriceGroupByFactor(price, groupingFactor);
  if (priceGroup === 0) return;
  const priceSizeDelta = size - prevPriceSize;
  const prevGroupSize = map.get(priceGroup) ?? 0;
  const newGroupSize = prevGroupSize + priceSizeDelta;
  updatePriceSizeEntry(map, priceGroup, newGroupSize);
};

export const updatePriceSizeMaps = (
  originalDelta: [Price, Size][],
  originalData: PriceSizeMap,
  groupedData: PriceSizeMap,
  groupingFactor: number,
) => {
  originalDelta.forEach(([price, size]) => {
    const prevSize = originalData.get(price) ?? 0;
    updatePriceSizeEntry(originalData, price, size);
    updateGroupedPriceSizeEntry(groupedData, price, size, prevSize, groupingFactor);
  });
};

export const applySnapshotOrders = (
  snapshot: [Price, Size][],
  originalMap: PriceSizeMap,
  groupedMap: PriceSizeMap,
  groupingFactor: number,
) => {
  snapshot.forEach(([price, size]) => {
    originalMap.set(price, size);
    const priceGroup = getPriceGroupByFactor(price, groupingFactor);
    groupedMap.set(priceGroup, (groupedMap.get(priceGroup) ?? 0) + size);
  });
};

export const recomputeGroupedPriceSizeMap = (
  groupedMap: PriceSizeMap,
  originalMap: PriceSizeMap,
  groupingFactor: GroupingFactor,
) => {
  groupedMap.clear();
  Array.from(originalMap.entries()).forEach(([price, size]) => {
    updateGroupedPriceSizeEntry(groupedMap, price, size, 0, groupingFactor);
  });
};

const toOrdersWithTotal = (
  priceSizeMap: PriceSizeMap,
  sortFn: (a: number, b: number) => number,
) => {
  const ordered = Array.from(priceSizeMap.entries())
    .sort(([priceA], [priceB]) => sortFn(priceA, priceB));
  const slicedAndOrdered = ordered.slice(0, Math.min(ORDERS_LIMIT, priceSizeMap.size));
  let total = 0;
  const ordersWithTotal = slicedAndOrdered.map<[number, number, number]>(
    ([price, size]) => {
      total += size;
      return [price, size, total];
    },
  );
  return ordersWithTotal;
};

export const toAskOrdersWithTotal = (groupedAsks: PriceSizeMap) => (
  toOrdersWithTotal(groupedAsks, ascending)
);

export const toBidOrdersWithTotal = (groupedBids: PriceSizeMap) => (
  toOrdersWithTotal(groupedBids, descending)
);
