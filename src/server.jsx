// this is the worker (server0side) entry-point

/* global WebSocketPair, Response */

import { renderToString } from 'react-dom/server'
import staticLocationHook from 'wouter/static-location'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

import html from '~/index.html'
import App, { routes } from '~/app.jsx'

export default {
  async fetch (request, env, ctx) {
    const { pathname } = new URL(request.url)

    // TODO: use a proper route-matcher
    const currentRoute = routes.find(r => r?.route === pathname)

    // websockets are supported
    const up = request.headers.get('upgrade')
    if (up && up === 'websocket') {
      const [client, server] = Object.values(new WebSocketPair())
      server.accept()
      if (currentRoute?.socket) {
        currentRoute.socket(server)
      }
      return new Response(null, {
        status: 101,
        webSocket: client
      })
    }

    let props = {}
    let status = 200

    // if there is a server function exported by the page, use it
    if (currentRoute?.server) {
      const r = await currentRoute.server({ request, env, ctx })
      if (r instanceof Response) {
        return r
      } else {
        props = r.props
        status = r.status
      }
    }

    // TODO: let router fall through on missing: router -> public -> 404 (using react page)
    // TODO: use a cache
    // TODO: HMR over miniflare live-reloading

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
      .replace('{CONTENT}', renderToString(<App routeProps={props} hook={staticLocationHook(pathname)} />))
      .replace('{PAGE_DATA}', JSON.stringify(props))

    return new Response(content, {
      status,
      headers: {
        'content-type': 'text/html'
      }
    })
  }
}
