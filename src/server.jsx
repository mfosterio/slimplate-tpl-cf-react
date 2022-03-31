// this is the worker (server-side) entry-point

/* global WebSocketPair, Response */

import { renderToString } from 'react-dom/server'
import staticLocationHook from 'wouter/static-location'
import { getAssetFromKV } from '@cloudflare/kv-asset-handler'

import html from '~/index.html'
import App, { findRoute } from '~/app.jsx'
import ASSET_MANIFEST from '__STATIC_CONTENT_MANIFEST'

// do all the server-side stuff for a single page
async function getPage (route, status = 200, serverParams, props = {}) {
  // find first path that matches
  let currentRoute = findRoute(route)

  if (currentRoute) {
    const s = currentRoute.server ? await currentRoute.server(serverParams) : {}
    props = { ...s.props, params: currentRoute.params }
    status = s.status || status
  } else {
    currentRoute = findRoute('/404')
    status = 404
  }

  const content = html
    .replace('{CONTENT}', renderToString(<App routeProps={props} hook={staticLocationHook(route)} />))
    .replace('{PAGE_DATA}', JSON.stringify(props))

  return new Response(content, {
    status,
    headers: {
      'content-type': 'text/html'
    }
  })
}

export default {
  async fetch (request, env, ctx) {
    const serverParams = { request, env, ctx }
    const { pathname } = new URL(request.url)

    // they are trying to get the source of the server
    if (pathname.startsWith('/build/server')) {
      return getPage('/404', 404, serverParams)
    }

    let currentRoute = findRoute(pathname)

    // collect props on a client-side route-change
    if (pathname === '/_props') {
      const u = new URL(request.url)
      currentRoute = findRoute(request.headers.get('referer').replace(u.origin, ''))
    }

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

    // run server() for SSR props & client-side route-changes
    if (currentRoute?.server) {
      const server = await currentRoute.server(serverParams)
      // if server() returns a Response, send it raw
      if (server instanceof Response) {
        return server
      }
      props = { ...props, ...server.props }
      status = server.status || status

      // use server-side to return server-side props
      if (pathname === '/_props') {
        return new Response(JSON.stringify(props), { status })
      }
    }

    // if there is a component, return it
    if (currentRoute?.default) {
      return getPage(pathname, status, serverParams, props)
    }

    // handle static assets
    try {
      return await getAssetFromKV(
        {
          request,
          waitUntil (promise) {
            return ctx.waitUntil(promise)
          }
        },
        {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST
        }
      )
    } catch (e) {
      return getPage('/404', 404, serverParams)
    }
  }
}
