import ReactDOM from 'react-dom';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import { OrdersFeedProvider } from 'components/OrdersFeedContext';
import { ErrorNotifierProvider } from 'components/ErrorNotifierProvider';
import theme from 'theme';
import App from 'App';

const ordersFeedWorker = new Worker('./worker', { name: 'ordersFeedWorker', type: 'module' });

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <ErrorNotifierProvider>
      <OrdersFeedProvider ordersFeedWorker={ordersFeedWorker}>
        <App />
      </OrdersFeedProvider>
    </ErrorNotifierProvider>
  </ThemeProvider>,
  document.getElementById('root'),
);
