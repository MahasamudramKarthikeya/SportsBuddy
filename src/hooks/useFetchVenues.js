import { useEffect, useState } from "react";

const useFetchVenues = (lat, lng, pageNo) => {
  const [venueList, setVenueList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setVenueList([]);
    setHasMore(true);
  }, [lat, lng]);

  useEffect(() => {
    if (!lat || !lng || !hasMore) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://serverforsportsbuddy.onrender.com/api/venues?lat=${lat}&lng=${lng}&pageNo=${pageNo}`
        );
        const json = await response.json();
        const newData = json?.data?.venueList || [];

        setVenueList((prev) => [...prev, ...newData]);

        if (newData.length === 0) setHasMore(false);
      } catch (error) {
        console.error("Error fetching venues:", error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [lat, lng, pageNo, hasMore]);

  return { venueList, loading, hasMore };
};

export default useFetchVenues;
