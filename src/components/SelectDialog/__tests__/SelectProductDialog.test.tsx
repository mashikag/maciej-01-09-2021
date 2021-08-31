import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductId } from 'resources/api/Cryptofacilities';
import { feedCaller, render } from 'utils/testUtils';
import { SelectProductDialog } from '..';

// More generic select dialog tests are coverred in SelectDialog.test.tsx
describe('Test SelectProductDialog component', () => {
  it('Should display XBT/USD and ETH/USD as options', () => {
    render(<SelectProductDialog open onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'XBT/USD' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ETH/USD' })).toBeInTheDocument();
  });

  it('Should call subscribe with the selected product on selection', () => {
    const feedCallerCtxt = feedCaller({ subscribe: jest.fn() });
    render(<SelectProductDialog open onClose={() => {}} />, { feedCallerCtxt });
    userEvent.click(screen.getByRole('button', { name: 'ETH/USD' }));
    expect(feedCallerCtxt.subscribe).toBeCalledWith(ProductId.EthereumUSD);
  });
});
