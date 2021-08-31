import { useMediaQuery as useMuiMediaQuery } from '@material-ui/core';

const useMediaQuery: typeof useMuiMediaQuery = (query, options) => (
  useMuiMediaQuery(query, { ...options, noSsr: true })
);

export default useMediaQuery;
