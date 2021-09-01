import { colors, createTheme } from '@material-ui/core';

const theme = createTheme({
  palette: {
    type: 'dark',
    primary: {
      main: colors.grey[800],
    },
  },
});

export default theme;
