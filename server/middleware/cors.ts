export default defineEventHandler(event => {
  // CORS_ALLOWED_ORIGIN: set to a specific domain (e.g., "https://example.com") to restrict,
  // or leave unset/"*" to allow all origins (default)
  // Supports comma-separated list for multiple origins (e.g., "https://a.com,https://b.com")
  const allowedOrigin = process.env.CORS_ALLOWED_ORIGIN || '*';
  const requestOrigin = getRequestHeader(event, 'origin');

  // Determine the CORS origin to return
  let corsOrigin = allowedOrigin;
  if (allowedOrigin === '*') {
    corsOrigin = '*';
  } else if (requestOrigin) {
    const allowedOrigins = allowedOrigin.split(',').map(o => o.trim());
    corsOrigin = allowedOrigins.includes(requestOrigin) ? requestOrigin : '';
  }

  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'Access-Control-Allow-Headers': '*',
  });

  if (event.method === 'OPTIONS') {
    event.node.res.statusCode = 204;
    return '';
  }
});
