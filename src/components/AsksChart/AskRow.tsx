import { colors } from '@material-ui/core';
import { OrdersChartBar, OrdersChartBarProps } from 'components/OrdersChart';

type AskRowProps = Omit<OrdersChartBarProps, 'barColor' | 'priceColor'>;

const AskRow = (props: AskRowProps) => {
  // eslint-disable-next-line react/destructuring-assignment
  const percent = (props.barSize / props.maxBarSize) * 100;
  if (percent > 100) {
    console.warn(percent);
  }

  return (
    <OrdersChartBar
      {...props}
      barColor={colors.red[900]}
      priceColor={colors.red[400]}
    />
  );
};

export default AskRow;
