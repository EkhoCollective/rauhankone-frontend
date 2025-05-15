export async function submitData() {
  try {
      const response = await fetch('https://peacemachine.eu/get_clusters', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 
            'Accept': 'application/json',
            'X-API-Key': '2KJkiKMXcP9SnY' 
            },
          body: JSON.stringify({
            "language": "Any",
            "max_stories": 100,
            "story": null
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

