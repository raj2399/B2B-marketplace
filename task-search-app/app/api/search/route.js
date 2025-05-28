export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to the backend API
    const backendUrl = 'http://localhost:5000/api/search';
    const url = searchParams.toString() 
      ? `${backendUrl}?${searchParams.toString()}`
      : backendUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status}`);
    }

    // Get the data from backend and return it directly
    const data = await response.json();
    return Response.json(data);

  } catch (error) {
    console.error('Search API error:', error);
    return Response.json({ 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
} 