import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Key, ReactNode } from 'react';
import { ORDERS_LIMIT } from 'resources/ordersFeed/constants';
import { Orders as FeedOrders } from 'resources/ordersFeed/types';

type OrderRowRenderProps = {
  key?: Key
  price?: number
  size?: number
  total: number
};

export type OrderRowRenderer = (props: OrderRowRenderProps) => ReactNode;

export type OrdersChartHeaders = [string, string, string];

export type OrdersChartProps = {
  headers: OrdersChartHeaders
  rows: FeedOrders
  rowRenderer: OrderRowRenderer
  dummyRowTotal: number
  prependDummyRows?: boolean
};

const OrdersChart = ({
  headers,
  rows,
  rowRenderer,
  dummyRowTotal,
  prependDummyRows = false,
}: OrdersChartProps) => {
  const dummyRows: ReactNode[] = [];
  for (let i = 0; i < ORDERS_LIMIT - rows.length;) {
    dummyRows.push(rowRenderer({ key: `dummyRow-${i}-${dummyRowTotal}`, total: dummyRowTotal }));
    i += 1;
  }
  return (
    <TableContainer>
      <Table size="small" aria-label="Orders table">
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header} align="right">{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {prependDummyRows && dummyRows}
          {rows.map(([price, size, total]) => rowRenderer({
            key: price, price, size, total,
          }))}
          {!prependDummyRows && dummyRows}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersChart;
