export const formatNumber = (num: number) => num.toLocaleString('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// the below are utils for sorting number arrays to be used with Array.prototype.sort
export const ascending = (a: number, b: number) => a - b;
export const descending = (a: number, b: number) => b - a;
