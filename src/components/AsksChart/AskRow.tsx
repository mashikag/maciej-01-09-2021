import { colors } from '@material-ui/core';
import { OrdersChartBar, OrdersChartBarProps } from 'components/OrdersChart';

type AskRowProps = Omit<OrdersChartBarProps, 'barColor' | 'priceColor'>;

const AskRow = (props: AskRowProps) => (
  <OrdersChartBar
    {...props}
    barColor={colors.red[900]}
    priceColor={colors.red[900]}
  />
);

export default AskRow;
