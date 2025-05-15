// Get authentication token
export async function getAuthToken(API_URL:string) {
  try {
    const response = await fetch(`${API_URL}/auth/app-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json();
    
    // Store tokens if needed
    localStorage.setItem('accessToken', data.access_token);
    localStorage.setItem('refreshToken', data.refresh_token);
    
    return data;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}