export async function fetchGreeting(): Promise<string> {
  try {
    const response = await fetch('http://localhost:5000/api/test');
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    return data.message;
  } catch (error) {
    console.error('API error:', error);
    throw error;
  }
}
