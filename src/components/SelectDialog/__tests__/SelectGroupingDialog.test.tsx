import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductId } from 'resources/api/Cryptofacilities';
import {
  feedCaller, feedState, feedStateMetadata, render,
} from 'utils/testUtils';
import { SelectGroupingDialog } from '..';

// More generic select dialog tests are coverred in SelectDialog.test.tsx
describe('Test SelectGroupingDialog component', () => {
  it.each([
    { productId: ProductId.BitcoinUSD, expected: ['0.50', '1.00', '2.50'] },
    { productId: ProductId.EthereumUSD, expected: ['0.10', '0.25', '0.50'] },
  ])(
    'Should display $expected options when current product is $productId ',
    ({ productId, expected }) => {
      const feedStateCtxt = feedState({
        metadata: feedStateMetadata({ productId }),
      });
      render(
        <SelectGroupingDialog open onClose={() => {}} />,
        { feedStateCtxt },
      );
      expected.forEach(
        (buttonLabel) => (
          expect(screen.getByRole('button', { name: buttonLabel })).toBeInTheDocument()
        ),
      );
    },
  );

  it('Should call groupBy with the selected grouping factor when an option is selected', () => {
    const feedStateCtxt = feedState({
      metadata: feedStateMetadata({ productId: ProductId.BitcoinUSD }),
    });
    const feedCallerCtxt = feedCaller({ groupBy: jest.fn() });
    render(
      <SelectGroupingDialog open onClose={() => {}} />,
      { feedStateCtxt, feedCallerCtxt },
    );
    userEvent.click(screen.getByRole('button', { name: '2.50' }));
    expect(feedCallerCtxt.groupBy).toBeCalledWith(2.5);
  });
});
