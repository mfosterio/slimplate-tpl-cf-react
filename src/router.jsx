import { Route, Switch, Router } from 'wouter'
import * as pages from './pages/**/*.jsx'

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

export default function AppRouter ({ routeProps, ...props }) {
  return (
    <Router {...props}>
      <Switch>
        {routes.map((handler, i) => (
          <Route key={i} path={handler.route} component={p => <handler.default {...p} {...routeProps} />} />
        ))}
      </Switch>
    </Router>
  )
}
