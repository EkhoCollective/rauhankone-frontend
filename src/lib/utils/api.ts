export async function submitData() {
  try {
      const response = await fetch('http://localhost:8888/get_clusters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            "language": "Finnish",
            "max_stories": 10
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