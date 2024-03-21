import { useState, useEffect, useRef, useCallback } from "react";

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const doFetch = useCallback(() => {
    if (options.enabled === false) {
      setLoading(false);
      return;
    }

    controllerRef.current = new AbortController();
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          credentials: "same-origin",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url, options.enabled]);

  useEffect(() => {
    doFetch();

    // Clean up function
    return () => {
      // Abort fetch if component unmounts before fetch completes
      controllerRef?.current?.abort?.();
    };
  }, [doFetch]);

  return { data, loading, error, refetch: doFetch };
};

export default useFetch;
