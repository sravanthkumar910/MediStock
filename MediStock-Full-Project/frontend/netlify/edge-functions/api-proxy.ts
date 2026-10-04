import type { Config } from '@netlify/edge-functions'

// Forwards /api/* to the Render backend server-side. The browser only talks to the
// Netlify origin, so the backend's CORS allow-list never applies (works on previews too).
export default async (req: Request) => {
  const backend = Netlify.env.get('BACKEND_URL') || 'https://medistock-web-management.onrender.com'
  const url = new URL(req.url)
  const target = new URL(url.pathname + url.search, backend)

  const headers = new Headers(req.headers)
  for (const name of ['host', 'origin', 'referer', 'connection', 'content-length']) headers.delete(name)

  const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
  const response = await fetch(target, {
    method: req.method,
    headers,
    body: hasBody ? await req.arrayBuffer() : undefined,
    redirect: 'manual',
  })

  const responseHeaders = new Headers(response.headers)
  for (const name of [...responseHeaders.keys()]) {
    if (name.startsWith('access-control-')) responseHeaders.delete(name)
  }
  return new Response(response.body, { status: response.status, headers: responseHeaders })
}

export const config: Config = {
  path: '/api/*',
}
