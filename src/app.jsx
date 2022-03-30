// this is used to display every part of your app, on client & server
// it should have the "page frame" and router, if you need that
// also have a look at ~/index.html which has the HTML that is initially loaded statitically, on server-side.

import { Route, Router } from 'wouter'
import * as pages from './pages/**/*.jsx'

// optional, but this is your global style
import '~/style.css'

// build a router object out of pages
export const routes = pages.filenames.map((filename, f) => {
  const route = filename.replace(/^\.\/pages\/(.+)\.jsx$/, '/$1').replace(/\$/g, ':').replace(/index/, '')
  const handler = pages.default[f]
  handler.filename = filename
  if (route !== '/404' && !route.startsWith('/_')) {
    handler.route = route
  }
  return handler
})

export default function App ({ routeProps, ...props }) {
  return (
    <>
      <header>
        <h1>Slimplate Demo App</h1>
      </header>
      <main>
        <Router {...props}>
          {routes.filter(h => h.route && h.default).map((handler, i) => (
            <Route key={i} path={handler.route} component={() => (<handler.default {...routeProps} />)} />
          ))}
        </Router>
      </main>
    </>
  )
}
