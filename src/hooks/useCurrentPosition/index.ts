import { useEffect, useState } from 'react';

interface Position {
  readonly latitude?: number;
  readonly longitude?: number;
}

export const useCurrentPosition = () => {
  const [position, setPosition] = useState<Position>({});
  const [error, setError] = useState<PositionError | string>();
  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setPosition({
        latitude,
        longitude,
      });
    }, setError);
  }, []);

  return { position, error };
};
