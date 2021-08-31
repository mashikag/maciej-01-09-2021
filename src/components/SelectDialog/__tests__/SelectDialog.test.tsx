import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectDialog from '../SelectDialog';

const OPTIONS = [
  { label: 'Apple', value: 0 },
  { label: 'Banana', value: 1 },
  { label: 'Carrot', value: 2 },
];

describe('Test SelectDialog component', () => {
  it('Should display option buttons with labels', () => {
    render(
      <SelectDialog
        onClose={() => {}}
        onSelected={() => {}}
        open
        options={OPTIONS}
        selected={0}
        title="Food"
      />,
    );
    OPTIONS.forEach(
      ({ label }) => expect(screen.getByRole('button', { name: label })).toBeInTheDocument(),
    );
  });

  it('Should display the selected option as disabled', () => {
    render(
      <SelectDialog
        onClose={() => {}}
        onSelected={() => {}}
        open
        options={OPTIONS}
        selected={0}
        title="Food"
      />,
    );
    expect(screen.getByRole('button', { name: 'Apple' })).toBeDisabled();
  });

  it('Should call onSelected with value of the selected option and onClose after selection is made', () => {
    const onSelected = jest.fn();
    const onClose = jest.fn();
    render(
      <SelectDialog
        onClose={onClose}
        onSelected={onSelected}
        open
        options={OPTIONS}
        selected={0}
        title="Food"
      />,
    );
    userEvent.click(screen.getByRole('button', { name: 'Banana' }));
    expect(onSelected).toBeCalledWith(1);
    expect(onClose).toBeCalled();
  });
});
