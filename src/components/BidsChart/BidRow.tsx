import { colors } from '@material-ui/core';
import { OrdersChartBar, OrdersChartBarProps } from 'components/OrdersChart';
import { useResponsiveSize } from 'hooks';

type BidRowProps = Omit<OrdersChartBarProps, 'barColor' | 'priceColor'>;

const BidRow = (props: BidRowProps) => {
  const { isLargeScreen } = useResponsiveSize();
  // eslint-disable-next-line react/destructuring-assignment
  // const percent = (props.barSize / props.maxBarSize) * 100;
  // if (percent > 100) {
  //   console.warn(percent);
  // }

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
