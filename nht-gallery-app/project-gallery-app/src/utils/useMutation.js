import { useState, useEffect, useRef } from "react";

const headers = new Headers({
  "X-WP-Nonce": window.nhtData?.nonce, // Access nonce from global object
  "Content-Type": "application/json",
});

const useMutation = (url, options = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  useEffect(() => {
    // Clean up function
    return () => {
      // Abort fetch if component unmounts before fetch completes
      controllerRef?.current?.abort?.();
    };
  }, [url]);

  const mutate = async (data, overrideUrl) => {
    controllerRef.current = new AbortController();
    setLoading(true);
    setError(null);
    let body = data;
    if (options["Content-Type"] !== "text/plain") {
      body = JSON.stringify(data);
    }

    try {
      const response = await fetch(overrideUrl || url, {
        method: "POST",
        body,
        credentials: "same-origin",
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to execute mutation");
      }

      return await response.json();
    } catch (error) {
      setError(error);
    } finally {
      controllerRef.current = null;
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

export default useMutation;
