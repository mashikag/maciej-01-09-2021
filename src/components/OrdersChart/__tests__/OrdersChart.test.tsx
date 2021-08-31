import { render, screen } from '@testing-library/react';
import { ORDERS_LIMIT } from 'resources/ordersFeed/constants';
import { Orders } from 'resources/ordersFeed/types';
import { OrderRowRenderer } from '..';
import OrdersChart, { OrdersChartHeaders } from '../OrdersChart';
import OrdersChartBar from '../OrdersChartBar';

describe('Test OrdersChart component', () => {
  it('Should render Price, Size, Total column headings', () => {
    const headers: OrdersChartHeaders = ['Price', 'Size', 'Total'];
    render(<OrdersChart
      headers={headers}
      rows={[]}
      rowRenderer={() => null}
      dummyRowTotal={0}
    />);
    headers.forEach(
      (header) => expect(screen.getByText(header)).toBeInTheDocument(),
    );
  });

  const orders: Orders = [[1, 1, 1], [2, 2, 3], [3, 3, 6]];
  const expectedDummyRowsCount = ORDERS_LIMIT - orders.length;
  it(
    `Should render ${expectedDummyRowsCount} dummy rows `
  + `when data for only ${ORDERS_LIMIT - expectedDummyRowsCount} rows is provided`,
    () => {
      const rowRenderer: OrderRowRenderer = (props) => (
        <OrdersChartBar
          {...props}
          barSize={0}
          maxBarSize={0}
          barColor="red"
          priceColor="red"
        />
      );
      render(<OrdersChart
        headers={['header1', 'header2', 'header3']}
        rows={orders}
        rowRenderer={rowRenderer}
        dummyRowTotal={0}
      />);
      const expectedEmptyCellText = '-';
      const expectedEmptyCellsCount = expectedDummyRowsCount * 2;
      expect(
        screen.getAllByRole('cell', { name: expectedEmptyCellText }),
      ).toHaveLength(expectedEmptyCellsCount);
    },
  );
});
