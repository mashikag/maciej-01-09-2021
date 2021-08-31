import { useMemo } from 'react';
import { SMALL_SCREEN_MEDIA_QUERY } from 'utils/styles';
import { ResponsiveSize } from '../constants';
import useMediaQuery from './useMediaQuery';

const useResponsiveSize = () => {
  const size = useMediaQuery(SMALL_SCREEN_MEDIA_QUERY)
    ? ResponsiveSize.Small
    : ResponsiveSize.Large;
  return useMemo(() => ({
    size,
    isSmallScreen: size === ResponsiveSize.Small,
    isLargeScreen: size === ResponsiveSize.Large,
  }), [size]);
};

export default useResponsiveSize;
