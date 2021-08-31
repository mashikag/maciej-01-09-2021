import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { OrdersFeedProvider } from 'components/OrdersFeedContext/OrdersFeedProvider';
import { ErrorNotifierProvider } from 'components/ErrorNotifierProvider';
import App from './App';

const ordersFeedWorker = new Worker('./worker', { name: 'ordersFeedWorker', type: 'module' });

ReactDOM.render(
  <StrictMode>
    <ErrorNotifierProvider>
      <OrdersFeedProvider ordersFeedWorker={ordersFeedWorker}>
        <App />
      </OrdersFeedProvider>
    </ErrorNotifierProvider>
  </StrictMode>,
  document.getElementById('root'),
);
