import { baseUrl } from "./consts";

// Get authentication token
export async function getAuthToken() {
  try {
    const API_URL = baseUrl;
    const response = await fetch(`${API_URL}/auth/app-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    // Store tokens if needed
    sessionStorage.setItem('accessToken', data.access_token);
    sessionStorage.setItem('refreshToken', data.refresh_token);
    
    return data;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}