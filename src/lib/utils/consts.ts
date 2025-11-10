const restEnv = import.meta.env.VITE_REST_ENV;
export const baseUrl = restEnv === 'development' ? 'https://prod.peacemachine.eu' : 'https://prod.peacemachine.eu';
console.log('API Base URL:', baseUrl);
//export const baseUrl = 'https://prod.peacemachine.eu';

