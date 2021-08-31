import { useOrdersFeedState } from 'components/OrdersFeedContext';
import OrdersChart, { OrdersChartProps, OrderRowRenderer, OrdersChartHeaders } from 'components/OrdersChart';
import { useResponsiveSize } from 'hooks';
import { resolveMaxTotal } from 'utils/orders';
import { useCallback } from 'react';
import AskRow from './AskRow';

const HEADERS: OrdersChartHeaders = ['Price', 'Size', 'Total'];

type AsksChartProps = {
  asks: OrdersChartProps['rows']
  maxBarSize: number
};

const ResponsiveAsksChart = ({ asks, maxBarSize }: AsksChartProps) => {
  const { isSmallScreen } = useResponsiveSize();
  const rowRenderer: OrderRowRenderer = useCallback(
    ({ total, ...props }) => (
      <AskRow
        {...props}
        total={total}
        barSize={total}
        maxBarSize={maxBarSize}
      />
    ), [maxBarSize],
  );
  const maxAsksTotal = asks.length ? asks[asks.length - 1][2] : 0;
  return (
    <OrdersChart
      headers={HEADERS}
      rows={isSmallScreen ? asks.reverse() : asks}
      rowRenderer={rowRenderer}
      dummyRowTotal={maxAsksTotal}
      prependDummyRows={isSmallScreen}
    />
  );
};

const AsksChart = () => {
  const { orders: { asks, bids } } = useOrdersFeedState();
  const maxTotal = resolveMaxTotal(asks, bids);
  return <ResponsiveAsksChart asks={asks} maxBarSize={maxTotal} />;
};

export default AsksChart;
