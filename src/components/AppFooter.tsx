import {
  Button,
  colors,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { ProductId } from 'resources/api/Cryptofacilities';
import { SMALL_SCREEN_MEDIA_QUERY } from 'utils/styles';
import { useOrdersFeedState, useOrdersFeedCaller } from './OrdersFeedContext';

const useStyles = makeStyles({
  footer: {
    marginTop: 16,
    marginBottom: 16,
    [SMALL_SCREEN_MEDIA_QUERY]: {
      paddingRight: 16,
      paddingLeft: 16,
    },
  },
  reviveButton: {
    backgroundColor: colors.green[700],
    '&:hover': {
      backgroundColor: colors.green[900],
    },
  },
  killButton: {
    backgroundColor: colors.red[700],
    '&:hover': {
      backgroundColor: colors.red[900],
    },
  },
});

const AppFooter = () => {
  const classes = useStyles();
  const { metadata: { hasError, productId, subscribed } } = useOrdersFeedState();
  const { kill, subscribe, unsubscribe } = useOrdersFeedCaller();
  return (
    <Grid container direction="row" justifyContent="flex-end" className={classes.footer}>
      <Grid item>
        <FormControlLabel
          control={(
            <Switch
              checked={subscribed}
              color="primary"
              onChange={(_, checked) => {
                if (checked && !subscribed) {
                  subscribe(productId);
                } else {
                  unsubscribe();
                }
              }}
            />
            )}
          label={subscribed ? 'Subscribed' : 'Unsubscribed'}
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (hasError) {
              subscribe(ProductId.BitcoinUSD);
            } else {
              kill();
            }
          }}
          className={hasError ? classes.reviveButton : classes.killButton}
        >
          {hasError ? 'Revive' : 'Kill feed'}
        </Button>
      </Grid>
    </Grid>
  );
};

export default AppFooter;
