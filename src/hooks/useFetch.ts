import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string | null): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    setIsLoading(true);
    setError(null);

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Error al obtener los datos: ' + response.status);
        return response.json() as Promise<T>;
      })
      .then(responseData => {
        setData(responseData);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
        // TODO: ver como cancelar la peticion si el componente se desmonta aun queda pendiente investigar bien esto no esta completo
        // investigue sobre AbortController pero no lo implemente todavia
      });

  }, [url]);

  return { data, isLoading, error };
}
