import { makeStyles, TableCell, TableRow } from '@material-ui/core';
import { formatNumber } from 'utils/number';

type StylesProps = {
  priceColor: string
  barColor: string
  barSize: number
  maxBarSize: number
  rightToLeft?: boolean
};

const useStyles = makeStyles<{}, StylesProps>({
  horizontalBar: ({
    barColor, barSize, maxBarSize, rightToLeft = true,
  }) => ({
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      display: 'block',
      top: '0px',
      left: rightToLeft ? 'auto' : '0px',
      right: rightToLeft ? '0px' : 'auto',
      height: '100%',
      width: `${maxBarSize > 0 ? (barSize / maxBarSize) * 100 : 0}%`,
      backgroundColor: `${barColor}40`,
      zIndex: -1,
    },
  }),
  orderCell: {
    borderBottom: 'none',
  },
  priceCell: ({ priceColor }) => ({
    color: priceColor,
  }),
});

export type OrdersChartBarProps = {
  price?: number
  size?: number
  total: number
  barSize: number
  maxBarSize: number
  rightToLeft?: boolean
  priceColor: string
  barColor: string
};

type DirectedChartBarProps = Omit<OrdersChartBarProps, 'direction'>;

const OrdersChartBarLTR = ({
  price,
  size,
  total,
  barSize,
  maxBarSize,
  barColor,
  priceColor,
}:DirectedChartBarProps) => {
  const classes = useStyles({
    priceColor, barColor, barSize, maxBarSize, rightToLeft: false,
  });
  return (
    <TableRow key={price} className={classes.horizontalBar}>
      <TableCell align="right" className={`${classes.orderCell} ${classes.priceCell}`}>
        {price ? formatNumber(price) : '-'}
      </TableCell>
      <TableCell align="right" className={classes.orderCell}>
        {size ? formatNumber(size) : '-'}
      </TableCell>
      <TableCell align="right" className={classes.orderCell}>
        {formatNumber(total)}
      </TableCell>
    </TableRow>
  );
};

const OrdersChartBarRTL = ({
  price,
  size,
  total,
  barSize,
  maxBarSize,
  barColor,
  priceColor,
}:DirectedChartBarProps) => {
  const classes = useStyles({
    priceColor, barColor, barSize, maxBarSize, rightToLeft: true,
  });
  return (
    <TableRow key={price} className={classes.horizontalBar}>
      <TableCell align="right" className={classes.orderCell}>
        {formatNumber(total)}
      </TableCell>
      <TableCell align="right" className={classes.orderCell}>
        {size ? formatNumber(size) : '-'}
      </TableCell>
      <TableCell align="right" className={`${classes.orderCell} ${classes.priceCell}`}>
        {price ? formatNumber(price) : '-'}
      </TableCell>
    </TableRow>
  );
};

const OrdersChartBar = ({
  rightToLeft = false,
  ...props
}: OrdersChartBarProps) => (
  rightToLeft ? <OrdersChartBarRTL {...props} /> : <OrdersChartBarLTR {...props} />
);

export default OrdersChartBar;
