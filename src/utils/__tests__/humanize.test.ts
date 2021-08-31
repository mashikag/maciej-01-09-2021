import { ProductId } from 'resources/api/Cryptofacilities';
import { humanizeProduct } from '../humanize';

describe('Test humanize util', () => {
  it.each([
    [ProductId.BitcoinUSD, 'XBT/USD'],
    [ProductId.EthereumUSD, 'ETH/USD'],
    [ProductId.None, 'None'],
  ])('Should return %s for product id of %s', (productId, humanizedProduct) => {
    expect(humanizeProduct(productId)).toBe(humanizedProduct);
  });
});
