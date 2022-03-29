/* global WebSocketPair, Response */

import { renderToString } from 'react-dom/server'
import staticLocationHook from 'wouter/static-location'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

import html from '../public/index.html'
import AppRouter from './router.jsx'

export default {
  async fetch (request, env, ctx) {
    // websockets are supported
    const up = request.headers.get('upgrade')
    if (up && up === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair())
      server.accept()
      server.addEventListener('message', (event) => {
        // echo server
        server.send(event.data)
      })

      return new Response(null, {
        status: 101,
        webSocket: client
      })
    }

    const { pathname } = new URL(request.url)

    // TODO: grab SSR props here, and check status
    // TODO: use a cache

    // TODO: better assets
    if (pathname.startsWith('/build')) {
      return await getAssetFromKV(
        {
          request,
          waitUntil (promise) {
            return ctx.waitUntil(promise)
          }
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: env.__STATIC_CONTENT_MANIFEST
        }
      )
    }

    const content = html
      .replace('{CONTENT}', renderToString(<AppRouter hook={staticLocationHook(pathname)} />))
      .replace('{PAGE_DATA}', JSON.stringify({}))

    return new Response(content, {
      status: 200,
      headers: {
        'content-type': 'text/html'
      }
    })
  }
}
