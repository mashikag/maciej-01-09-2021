import { useEffect } from 'react';

const useIntervalCallback = (callback: () => void, ms: number) => {
  useEffect(() => {
    const interval = setInterval(callback, ms);
    return () => {
      clearInterval(interval);
    };
  }, []);
};

export default useIntervalCallback;
