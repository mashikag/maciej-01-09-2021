import { ProductId } from 'resources/api/Cryptofacilities';
import { GroupingFactorETH, GroupingFactorXBT } from 'resources/ordersFeed/types';
import { formatNumber } from 'utils/number';
import { useOrdersFeedState, useOrdersFeedCaller } from 'components/OrdersFeedContext';
import { toOptions } from 'utils/options';
import SelectDialog from './SelectDialog';

const ETH_GROUPING_FACTORS: GroupingFactorETH[] = [0.1, 0.25, 0.5];
const ETH_GROUPING_OPTIONS = toOptions(ETH_GROUPING_FACTORS, formatNumber);

const XBT_GROUPING_FACTORS: GroupingFactorXBT[] = [0.5, 1, 2.5];
const XBT_GROUPING_OPTIONS = toOptions(XBT_GROUPING_FACTORS, formatNumber);

const getOptions = (productId: ProductId) => {
  switch (productId) {
    case ProductId.BitcoinUSD:
      return XBT_GROUPING_OPTIONS;
    case ProductId.EthereumUSD:
      return ETH_GROUPING_OPTIONS;
    default:
      return [];
  }
};

type SelectGroupingDialogProps = {
  open: boolean
  onClose: () => void
};

const SelectGroupingDialog = ({
  open, onClose,
}: SelectGroupingDialogProps) => {
  const { groupBy } = useOrdersFeedCaller();
  const { metadata: { productId, groupingFactor } } = useOrdersFeedState();
  const options = getOptions(productId);
  return (
    <SelectDialog
      onClose={onClose}
      onSelected={(value) => groupBy(value)}
      open={open}
      options={options}
      selected={groupingFactor}
      title="Select grouping"
    />
  );
};

export default SelectGroupingDialog;
