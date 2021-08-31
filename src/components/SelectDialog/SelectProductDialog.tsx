import { ProductId } from 'resources/api/Cryptofacilities';
import { toOptions } from 'utils/options';
import { humanizeProduct } from 'utils/humanize';
import { useOrdersFeedCaller, useOrdersFeedState } from 'components/OrdersFeedContext';
import SelectDialog from './SelectDialog';

const PRODUCTS = [ProductId.BitcoinUSD, ProductId.EthereumUSD];
const PRODUCT_OPTIONS = toOptions(PRODUCTS, humanizeProduct);

type SelectMarketDialogProps = {
  open: boolean
  onClose: () => void
};

const SelectMarketDialog = ({
  open, onClose,
}: SelectMarketDialogProps) => {
  const { metadata: { productId } } = useOrdersFeedState();
  const { subscribe } = useOrdersFeedCaller();
  return (
    <SelectDialog
      onClose={onClose}
      onSelected={(value) => subscribe(value)}
      open={open}
      options={PRODUCT_OPTIONS}
      selected={productId}
      title="Select market"
    />
  );
};

export default SelectMarketDialog;
