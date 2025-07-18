import { useState, useEffect } from 'react';

export const useBugs = () => {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBugs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bugs');
      if (!response.ok) throw new Error('Failed to fetch bugs');
      const data = await response.json();
      setBugs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return { bugs, loading, error, refetch: fetchBugs };
};