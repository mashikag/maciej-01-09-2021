import { useCallback } from 'react';
import { useOrdersFeedState } from 'components/OrdersFeedContext';
import OrdersChart, { OrdersChartProps, OrderRowRenderer, OrdersChartHeaders } from 'components/OrdersChart';
import { useResponsiveSize } from 'hooks';
import { resolveMaxTotal } from 'utils/orders';
import BidRow from './BidRow';

const HEADERS_LARGE: OrdersChartHeaders = ['Total', 'Size', 'Price'];
const HEADERS_SMALL = HEADERS_LARGE.slice().reverse() as OrdersChartHeaders;

type BidsChartProps = {
  bids: OrdersChartProps['rows']
  maxBarSize: number
};

const ResponsiveBidsChart = ({ bids, maxBarSize }: BidsChartProps) => {
  const { isSmallScreen } = useResponsiveSize();
  const rowRenderer: OrderRowRenderer = useCallback(
    ({ total, ...props }) => (
      <BidRow
        {...props}
        total={total}
        barSize={total}
        maxBarSize={maxBarSize}
      />
    ), [maxBarSize],
  );
  if (isSmallScreen) {
    return (
      <OrdersChart
        headers={HEADERS_SMALL}
        rows={bids.slice().reverse()}
        rowRenderer={rowRenderer}
        dummyRowTotal={0}
      />
    );
  }
  const maxAsksTotal = bids.length ? bids[bids.length - 1][2] : 0;
  return (
    <OrdersChart
      headers={HEADERS_LARGE}
      rows={bids}
      rowRenderer={rowRenderer}
      dummyRowTotal={maxAsksTotal}
    />
  );
};

const BidsChart = () => {
  const { orders: { asks, bids } } = useOrdersFeedState();
  const maxTotal = resolveMaxTotal(asks, bids);
  return <ResponsiveBidsChart bids={bids} maxBarSize={maxTotal} />;
};

export default BidsChart;
