import { useEffect, useState } from 'react';

interface Position {
  readonly latitude?: number;
  readonly longitude?: number;
}

const defaultOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 0,
};

export const useWatchPosition = (options = defaultOptions) => {
  const [position, setPosition] = useState<Position>({});
  const [error, setError] = useState<PositionError | string>();

  useEffect(() => {
    const { geolocation } = navigator;
    if (!geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }
    const id = geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition({
          latitude: latitude,
          longitude: longitude,
        });
      },
      setError,
      options
    );
    return () => geolocation.clearWatch(id);
  }, []);

  return { position, error };
};
