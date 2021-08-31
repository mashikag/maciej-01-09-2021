import { useEffect } from 'react';
import {
  Container,
  Divider,
  Grid,
  styled,
} from '@material-ui/core';
import AppBar from 'components/AppBar';
import AppFooter from 'components/AppFooter';
import AsksChart from 'components/AsksChart';
import BidsChart from 'components/BidsChart';
import Loader from 'components/Loader';
import { useOrdersFeedCaller, useOrdersFeedState } from 'components/OrdersFeedContext';
import SpreadContainer from 'components/SpreadNote';
import { useResponsiveSize } from 'hooks';
import { ProductId } from 'resources/api/Cryptofacilities';
import { LARGE_SCREEN_MEDIA_QUERY } from 'utils/styles';
import { resolveSpread } from 'utils/orders';

const ResponsiveContainer = styled(Container)({
  [LARGE_SCREEN_MEDIA_QUERY]: {
    marginTop: 16,
  },
});

const App = () => {
  const { isLargeScreen, isSmallScreen } = useResponsiveSize();
  const { orders: { asks, bids } } = useOrdersFeedState();
  const { subscribe } = useOrdersFeedCaller();
  const isLoading = asks.length === 0 && bids.length === 0;
  const spread = resolveSpread(asks, bids);
  const spreadContent = isLoading
    ? 'Spread will apear here'
    : `Spread: ${spread?.money} (${spread?.percentage})`;

  useEffect(() => {
    subscribe(ProductId.BitcoinUSD);
  }, []);

  return (
    <ResponsiveContainer maxWidth="lg" disableGutters={isSmallScreen}>
      <AppBar />
      {isLoading && <Loader />}
      {isLargeScreen && <SpreadContainer>{spreadContent}</SpreadContainer>}
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item xs={isLargeScreen ? 6 : 12}>
          {isLargeScreen ? <BidsChart /> : <AsksChart />}
        </Grid>
        {isSmallScreen && (
        <Grid item xs={12}>
          <SpreadContainer>{spreadContent}</SpreadContainer>
        </Grid>
        )}
        <Grid item xs={isLargeScreen ? 6 : 12}>
          {isLargeScreen ? <AsksChart /> : <BidsChart />}
        </Grid>
      </Grid>
      <Divider />
      <AppFooter />
    </ResponsiveContainer>
  );
};

export default App;
