export interface GeolocationResult {
  coordinates: [number, number]; // [lng, lat]
  accuracyMeters: number;
  timestamp: string;
  source: 'LIVE_GPS' | 'LAST_KNOWN_GPS' | 'SIMULATED_FIELD';
}

export class DeviceGeolocationService {
  private watchId: number | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'geolocation' in navigator;
  }

  public async requestCurrentPosition(): Promise<GeolocationResult> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser.');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const now = new Date();
          const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
            .getMinutes()
            .toString()
            .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;

          resolve({
            coordinates: [position.coords.longitude, position.coords.latitude],
            accuracyMeters: Math.round(position.coords.accuracy),
            timestamp,
            source: 'LIVE_GPS'
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  public startWatching(
    onLocation: (result: GeolocationResult) => void,
    onError: (err: GeolocationPositionError) => void
  ): void {
    if (!this.isSupported()) return;

    this.stopWatching();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const now = new Date();
        const timestamp = `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;

        onLocation({
          coordinates: [position.coords.longitude, position.coords.latitude],
          accuracyMeters: Math.round(position.coords.accuracy),
          timestamp,
          source: 'LIVE_GPS'
        });
      },
      onError,
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 2000
      }
    );
  }

  public stopWatching(): void {
    if (this.watchId !== null && this.isSupported()) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}

export const deviceGeolocation = new DeviceGeolocationService();
