const restEnv = import.meta.env.VITE_REST_ENV;
export const baseUrl = restEnv === 'development' ? 'https://api.peacemachine.eu' : 'https://prod.peacemachine.eu';
//export const baseUrl = 'https://prod.peacemachine.eu';

