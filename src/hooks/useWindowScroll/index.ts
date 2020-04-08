import { useEffect, useState } from 'react';
import debounce from '../../utils/debounce';

export const useWindowScroll = () => {
  const [scroll, setScroll] = useState<number>(0);
  const debounceScroll = debounce(setScroll, 50);

  useEffect(() => {
    const onScrollChange = () => {
      debounceScroll(window.scrollY);
    };
    window.addEventListener('scroll', onScrollChange);
    return () => window.removeEventListener('scroll', onScrollChange);
  }, []);

  return scroll;
};
