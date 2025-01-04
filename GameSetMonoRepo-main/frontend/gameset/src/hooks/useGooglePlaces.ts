import { useState } from "react";

export const useGooglePlaces = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiKey: string = import.meta.env.VITE_MAPS_API;

  const fetchLatLng = async (address: string): Promise<{ lat: number; lng: number }> => {
    setLoading(true);

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch geocode data");
      }

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return { lat, lng };
      } else {
        throw new Error("No results found");
      }
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { fetchLatLng, loading, error };
};
