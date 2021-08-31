import { ProductId } from 'resources/api/Cryptofacilities';

const PRODUCT_ID_TO_NAME_MAP = {
  [ProductId.BitcoinUSD]: 'XBT/USD',
  [ProductId.EthereumUSD]: 'ETH/USD',
  [ProductId.None]: 'None',
};

export const humanizeProduct = (productId: ProductId) => PRODUCT_ID_TO_NAME_MAP[productId] ?? 'Undefined';
