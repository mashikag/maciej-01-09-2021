import {
  asMock,
  largeScreen,
  render,
  smallScreen,
} from 'utils/testUtils';
import { screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import useResponsiveSize from 'hooks/useResponsiveSize';
import AppBar from '../AppBar';

jest.mock('../../hooks/useResponsiveSize', () => jest.fn());

beforeEach(() => {
  asMock(useResponsiveSize).mockReturnValue(largeScreen());
});

describe('Test AppBar component', () => {
  it('Should open up select grouping dialog when app bar grouping button clicked ', () => {
    render(<AppBar />);
    user.click(screen.getByText('Group: 0.50'));
    expect(screen.getByText('Select grouping')).toBeInTheDocument();
  });

  it('Should open up select market dialog when app bar market button clicked ', () => {
    render(<AppBar />);
    user.click(screen.getByText('Group: 0.50'));
    expect(screen.getByText('Select grouping')).toBeInTheDocument();
  });

  it('Should render Ordersbook title when large screen', () => {
    render(<AppBar />);
    expect(screen.getByText('Ordersbook')).toBeInTheDocument();
  });

  it('Should not render Ordersbook title when small screen', () => {
    asMock(useResponsiveSize).mockReturnValue(smallScreen());
    render(<AppBar />);
    expect(screen.queryByText('Ordersbook')).not.toBeInTheDocument();
  });
});
