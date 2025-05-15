export async function submitData() {
  try {
      const response = await fetch('https://peacemachine.eu/docs/get_clusters', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'X-API-Key': '2KJkiKMXcP9SnY' 
            },
          body: JSON.stringify({
            "language": "Any",
            "max_stories": 100
          })
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return await response.json();
  } catch (error) {
      console.error(error);
      return null;
  }
}

