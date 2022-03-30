// this is used to display every part of your app, on client & server
// it should have the "page frame" and router, if you need that
// also have a look at ~/index.html which has the HTML that is initially loaded statitically, on server-side.

/* global fetch */

import { useState, useEffect } from 'react'
import { Route, Router, Link, useRoute } from 'wouter'
import { parse } from 'regexparam'
import cx from 'classnames'

import * as pages from './pages/**/*.[jt]s*'

// optional, but this is your global style
import '~/style.css'

// build a router object out of pages
export const routes = pages.filenames.map((filename, f) => {
  const route = filename.replace(/^\.\/pages\/(.+)\.[tj]sx?$/, '/$1').replace(/\$/g, ':').replace(/index/, '')
  const handler = pages.default[f]
  handler.filename = filename
  handler.route = route
  const { pattern, keys } = parse(route, false)
  handler.matchPath = path => {
    let i = 0
    const out = {}
    const matches = pattern.exec(path)
    if (!matches) {
      return false
    }
    while (i < keys.length) {
      out[keys[i]] = matches[++i] || null
    }
    return out
  }
  return handler
})

// get a single route with current params and export handlers
export function findRoute (path) {
  for (const route of routes) {
    const params = route.matchPath(path)
    if (params) {
      return { ...route, params }
    }
  }
  return false
}

// sort routes descending, by path-length to make them less-greedy ("/" doesn't match "/about")
routes.sort((a, b) => (b?.route?.length || 0) - (a?.route?.length || 0))

// link that tracks if it's active
const NavLink = ({ href, className, ...props }) => {
  const [active] = useRoute(href)
  return (
    <Link href={href}>
      <a className={cx(props.className, { active })} {...props} />
    </Link>
  )
}

export default function App ({ routeProps, ...props }) {
  const getPage = handler => p => {
    const [rprops, setRprops] = useState(routeProps)
    useEffect(() => {
      if (handler.server) {
        fetch('/_props').then(r => r.json()).then(r => setRprops(r))
      }
    }, [p])
    return (
      <handler.default {...rprops} {...p} />
    )
  }
  return (
    <Router {...props}>
      <header>
        <h1>Slimplate Demo App</h1>
        <nav>
          <NavLink href='/'>Home</NavLink>
          <NavLink href='/about'>About</NavLink>
          <NavLink href='/dynamic/cool'>Dynamic</NavLink>
        </nav>
      </header>
      <main>
        {routes.filter(h => h.route && h.default).map((handler, i) => (
          <Route key={i} path={handler.route} component={getPage(handler)} />
        ))}
      </main>
    </Router>
  )
}
