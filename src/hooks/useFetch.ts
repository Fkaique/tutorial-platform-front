import { useState, useEffect } from 'react';
import { api } from '../services/api';

export function useFetch<T = unknown>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsFetching(true);
    
    api.get(url)
      .then(response => {
        setData(response.data);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [url]);

  return { data, isFetching, error };
}