// Get questions
export interface ApiRequestOptions {
  API_ENDPOINT: string;
  API_METHOD: string;
  REQUEST_BODY?: any;
}

export async function apiRequest(OPTIONS: ApiRequestOptions) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No authentication token found. Get a token first.');
    }

    const API_URL = 'https://peacemachine.eu';

    const response = await fetch(`${API_URL}${OPTIONS.API_ENDPOINT}`, {
      method: OPTIONS.API_METHOD,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    body: JSON.stringify(OPTIONS.REQUEST_BODY)
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error ${response.status}: ${text}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error from endpoint "', OPTIONS.API_ENDPOINT, '":', error);
    return null;
  }
}