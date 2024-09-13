import { useEffect, useState } from "react";
import axios from "axios";

const useTimeZones = () => {
  const [timeZones, setTimeZones] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTimeZones = async () => {
      try {
        const response = await axios.get(
          "https://timeapi.io/api/TimeZone/AvailableTimeZones",
        );
        setTimeZones(response.data); // Assuming it returns an array of time zones
        setLoading(false);
      } catch (err) {
        setError("Error fetching time zones");
        setLoading(false);
      }
    };

    fetchTimeZones();
  }, []);
  return { timeZones, loading, error };
};
export default useTimeZones;
