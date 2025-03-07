export async function submitData(inputValue: string) {
  try {
      const response = await fetch('https://your-api-endpoint.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: inputValue })
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