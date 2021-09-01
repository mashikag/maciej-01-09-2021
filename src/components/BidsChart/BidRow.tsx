import { colors } from '@material-ui/core';
import { OrdersChartBar, OrdersChartBarProps } from 'components/OrdersChart';
import { useResponsiveSize } from 'hooks';

type BidRowProps = Omit<OrdersChartBarProps, 'barColor' | 'priceColor'>;

const BidRow = (props: BidRowProps) => {
  const { isLargeScreen } = useResponsiveSize();
  return (
    <OrdersChartBar
      {...props}
      barColor={colors.green[900]}
      priceColor={colors.green[400]}
      rightToLeft={isLargeScreen}
    />
  );
};

export default BidRow;
