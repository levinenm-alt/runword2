exports.handler = async function(event) {
  const targetUrl = event.queryStringParameters?.url;
  if (!targetUrl) {
    return { statusCode: 400, body: 'Missing url parameter' };
  }

  // Only allow requests to the LA Times puzzle CDN
  if (!targetUrl.startsWith('https://cdn3.amuselabs.com/lat/')) {
    return { statusCode: 403, body: 'Forbidden' };
  }

  try {
    const response = await fetch(targetUrl, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' }
    });
    if (!response.ok) {
      return { statusCode: response.status, body: `Upstream error: ${response.status}` };
    }
    const data = await response.text();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600'
      },
      body: data
    };
  } catch (err) {
    return { statusCode: 502, body: `Fetch failed: ${err.message}` };
  }
};
