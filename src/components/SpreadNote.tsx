import { ReactNode } from 'react';
import {
  Box, makeStyles, Typography,
} from '@material-ui/core';

const useStyles = makeStyles(({ palette, spacing }) => ({
  spreadContainer: {
    paddingTop: spacing(2),
    color: palette.grey[400],
    textAlign: 'center',
  },
}));

type SpreadContainerProps = {
  children: ReactNode
};

const SpreadContainer = ({ children }: SpreadContainerProps) => {
  const classes = useStyles();
  return (
    <Box className={classes.spreadContainer}>
      <Typography variant="body2">
        {children}
      </Typography>
    </Box>
  );
};

export default SpreadContainer;
