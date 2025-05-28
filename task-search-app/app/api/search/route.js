export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    const backendUrl = 'http://localhost:5000/api/search';
    const url = searchParams.toString() 
      ? `${backendUrl}?${searchParams.toString()}`
      : backendUrl;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Backend API request failed: ${response.status}`);
    }

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