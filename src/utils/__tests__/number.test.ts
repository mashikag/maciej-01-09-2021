import { ascending, descending, formatNumber } from 'utils/number';

describe('Test number util', () => {
  it.each([
    [0, '0.00'],
    [1, '1.00'],
    [123456, '123,456.00'],
    [123456789, '123,456,789.00'],
  ])('Should format %s as %s', (inputNumber, formatted) => {
    expect(formatNumber(inputNumber)).toBe(formatted);
  });

  it('Should sort an array of numbers in ascending order', () => {
    const input = [-5, -10, 9, 0, 16, 99, -99];
    expect(input.sort(ascending)).toEqual([-99, -10, -5, 0, 9, 16, 99]);
  });

  it('Should sort an array of numbers in descending order', () => {
    const input = [-5, -10, 9, 0, 16, 99, -99];
    expect(input.sort(descending)).toEqual([99, 16, 9, 0, -5, -10, -99]);
  });
});
