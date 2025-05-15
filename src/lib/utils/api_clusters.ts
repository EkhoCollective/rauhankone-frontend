// Get clusters with authentication
export async function getClusters(API_URL:string, options = { language: 'Any', max_stories: 100, story: null }) {
  try {
    // Get token from localStorage
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      throw new Error('No authentication token found. Get a token first.');
    }
    
    const response = await fetch(`${API_URL}/get_clusters`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(options)
    });
    
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error ${response.status}: ${text}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting clusters:', error);
    return null;
  }
}