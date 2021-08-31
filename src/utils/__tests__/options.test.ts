import { toOptions } from 'utils/options';

describe('Test options util', () => {
  it('Should create options array with label as value', () => {
    expect(toOptions([1, 2, 3])).toEqual([
      { label: '1', value: 1 },
      { label: '2', value: 2 },
      { label: '3', value: 3 },
    ]);
  });

  it('Should create options array with label as humanized value', () => {
    const humanizeFn = (v: number) => `humanized ${v}`;
    expect(toOptions([1, 2, 3], humanizeFn)).toEqual([
      { label: 'humanized 1', value: 1 },
      { label: 'humanized 2', value: 2 },
      { label: 'humanized 3', value: 3 },
    ]);
  });
});
