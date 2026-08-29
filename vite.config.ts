import { fileURLToPath, URL } from 'node:url'
import type { IncomingMessage, ServerResponse } from 'node:http'

import { defineConfig, type Plugin, type ViteDevServer, type PreviewServer } from 'vite'
import vue from '@vitejs/plugin-vue'

// Must match `OAUTH_TOKEN_PROXY_PATH` in `src/shared/api/endpoints.ts` —
// that's the path the browser actually calls; this is where it's handled.
const OAUTH_TOKEN_PROXY_PATH = '/api/github/oauth/token'
const GITHUB_ACCESS_TOKEN_URL = 'https://github.com/login/oauth/access_token'

function readRequestBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk: Buffer) => {
      raw += chunk.toString('utf-8')
    })
    req.on('end', () => resolve(raw))
    req.on('error', reject)
  })
}

async function handleOAuthTokenProxy(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.end()
    return
  }

  try {
    const rawBody = await readRequestBody(req)

    const githubResponse = await fetch(GITHUB_ACCESS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Without this, GitHub replies with a urlencoded query string
        // instead of JSON.
        Accept: 'application/json',
      },
      body: rawBody,
    })

    const responseText = await githubResponse.text()
    res.statusCode = githubResponse.status
    res.setHeader('Content-Type', 'application/json')
    res.end(responseText)
  } catch (error) {
    res.statusCode = 502
    res.setHeader('Content-Type', 'application/json')
    res.end(
      JSON.stringify({
        error: 'oauth_proxy_failed',
        error_description: error instanceof Error ? error.message : 'Unknown proxy error',
      }),
    )
  }
}

// GitHub's `POST /login/oauth/access_token` never sends
// `Access-Control-Allow-Origin`, so a browser blocks a direct `fetch()` to
// it from any origin — a long-standing, well-known limitation of GitHub's
// OAuth endpoint (see e.g. https://github.com/octocus/github-oauth-proxy),
// not something fixable from this app's code. The exchange has to happen
// from a server context instead, since CORS is a browser-only mechanism.
//
// This project has no real backend, so — for local use only, per the
// assignment's "must run locally" requirement — Vite's own dev/preview
// server plays that role: it forwards the POST body byte-for-byte to
// GitHub over a plain server-to-server request (no CORS involved) and
// relays the response back. It does not read, generate, or store the
// client secret; that still lives entirely in the browser
// (`shared/config/oauth.ts`) exactly as the assignment allows — this proxy
// only exists to route around GitHub's missing CORS headers.
//
// This only covers `npm run dev` and `npm run preview`. A real deployment
// on static hosting (no Vite server) would need an actual backend/BFF for
// this exchange — out of scope here since the assignment only requires the
// app to run locally.
function githubOAuthProxyPlugin(): Plugin {
  return {
    name: 'github-oauth-token-proxy',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(OAUTH_TOKEN_PROXY_PATH, (req, res) => {
        void handleOAuthTokenProxy(req, res)
      })
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(OAUTH_TOKEN_PROXY_PATH, (req, res) => {
        void handleOAuthTokenProxy(req, res)
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), githubOAuthProxyPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
