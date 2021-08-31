import { ReactNode } from 'react';
import {
  Box, colors, makeStyles, Typography,
} from '@material-ui/core';

const useStyles = makeStyles({
  spreadContainer: {
    paddingTop: 16,
    color: colors.grey[600],
    textAlign: 'center',
  },
});

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
