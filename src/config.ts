const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:3001/api' : '/api';

export const APP_API_URL = (configuredApiUrl && configuredApiUrl.length > 0 ? configuredApiUrl : defaultApiUrl).replace(/\/+$/, '');
