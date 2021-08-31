import { useState } from 'react';
import {
  AppBar as MaterialAppBar,
  Button,
  ButtonGroup,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { humanizeProduct } from 'utils/humanize';
import { formatNumber } from 'utils/number';
import { useResponsiveSize } from 'hooks';
import { SelectGroupingDialog, SelectProductDialog } from 'components/SelectDialog';
import { useOrdersFeedState } from 'components/OrdersFeedContext';

const useStyles = makeStyles({
  title: { flexGrow: 1 },
});

const AppBar = () => {
  const [openSelectMarket, setSelectMarketOpen] = useState(false);
  const [openSelectGrouping, setSelectGroupingOpen] = useState(false);
  const { metadata: { groupingFactor, productId } } = useOrdersFeedState();
  const classes = useStyles();
  const { isLargeScreen } = useResponsiveSize();
  return (
    <>
      <MaterialAppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {isLargeScreen && 'Ordersbook'}
          </Typography>
          <ButtonGroup color="inherit" aria-label="outlined primary button group">
            <Button
              onClick={() => setSelectMarketOpen(true)}
            >
              {`Market: ${humanizeProduct(productId)}`}
            </Button>
            <Button
              onClick={() => setSelectGroupingOpen(true)}
            >
              {`Group: ${formatNumber(groupingFactor)}`}
            </Button>
          </ButtonGroup>
        </Toolbar>
      </MaterialAppBar>

      <SelectGroupingDialog
        open={openSelectGrouping}
        onClose={() => setSelectGroupingOpen(false)}
      />
      <SelectProductDialog
        open={openSelectMarket}
        onClose={() => setSelectMarketOpen(false)}
      />
    </>
  );
};

export default AppBar;
