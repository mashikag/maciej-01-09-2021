import {
  Button,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
} from '@material-ui/core';
import { ProductId } from 'resources/api/Cryptofacilities';
import { useOrdersFeedState, useOrdersFeedCaller } from './OrdersFeedContext';

const useStyles = makeStyles(({ palette, spacing }) => ({
  footer: {
    marginTop: spacing(2),
    marginBottom: spacing(2),
    paddingRight: spacing(2),
    paddingLeft: spacing(2),
  },
  reviveButton: {
    backgroundColor: palette.success.main,
    '&:hover': {
      backgroundColor: palette.success.dark,
    },
  },
  killButton: {
    backgroundColor: palette.error.dark,
    '&:hover': {
      backgroundColor: palette.error.main,
    },
  },
}));

const AppFooter = () => {
  const classes = useStyles();
  const { metadata: { hasError, productId, subscribed } } = useOrdersFeedState();
  const { kill, subscribe, unsubscribe } = useOrdersFeedCaller();
  return (
    <Grid container direction="row" justifyContent="space-between" className={classes.footer}>
      <Grid item>
        <FormControlLabel
          control={(
            <Switch
              checked={subscribed}
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
          color="secondary"
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
