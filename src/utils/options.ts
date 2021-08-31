import { Option } from 'components/SelectDialog';

export const toOptions = <T>(values:T[], humanizeLabelFn?: (value: T) => string): Option<T>[] => (
  values.map((value) => ({
    label: humanizeLabelFn?.(value) ?? String(value),
    value,
  }))
);
