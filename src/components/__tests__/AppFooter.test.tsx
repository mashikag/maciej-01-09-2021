import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppFooter from 'components/AppFooter';
import { ProductId } from 'resources/api/Cryptofacilities';
import {
  feedCaller,
  feedState,
  feedStateMetadata,
  render,
} from 'utils/testUtils';

describe('Test AppFooter component', () => {
  it('Should call unsubscribe on switch click when checked', () => {
    const feedStateCtxt = feedState({
      metadata: feedStateMetadata({ subscribed: true }),
    });
    const feedCallerCtxt = feedCaller({ unsubscribe: jest.fn() });
    render(<AppFooter />, { feedStateCtxt, feedCallerCtxt });
    userEvent.click(screen.getByLabelText('Subscribed'));
    expect(feedCallerCtxt.unsubscribe).toBeCalled();
  });

  it('Should call subscribe on switch click when unchecked', () => {
    const feedStateCtxt = feedState({
      metadata: feedStateMetadata({ subscribed: false }),
    });
    const feedCallerCtxt = feedCaller({ subscribe: jest.fn() });
    render(<AppFooter />, { feedStateCtxt, feedCallerCtxt });
    userEvent.click(screen.getByLabelText('Unsubscribed'));
    expect(feedCallerCtxt.subscribe).toBeCalled();
  });

  it('Should call kill when kill feed button clicked', () => {
    const feedStateCtxt = feedState({
      metadata: feedStateMetadata({ hasError: false }),
    });
    const feedCallerCtxt = feedCaller({ kill: jest.fn() });
    render(<AppFooter />, { feedStateCtxt, feedCallerCtxt });
    userEvent.click(screen.getByRole('button', { name: 'Kill feed' }));
    expect(feedCallerCtxt.kill).toBeCalled();
  });

  it('Should call subscribe with the current product when revive button clicked', () => {
    const feedStateCtxt = feedState({
      metadata: feedStateMetadata({
        hasError: true,
        productId: ProductId.BitcoinUSD,
      }),
    });
    const feedCallerCtxt = feedCaller({ subscribe: jest.fn() });
    render(<AppFooter />, { feedStateCtxt, feedCallerCtxt });
    userEvent.click(screen.getByRole('button', { name: 'Revive' }));
    expect(feedCallerCtxt.subscribe).toBeCalledWith(ProductId.BitcoinUSD);
  });
});
