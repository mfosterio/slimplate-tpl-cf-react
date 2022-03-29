import ReactDOM from 'react-dom'

import AppRouter from './router.jsx'

// if this is client-side, hydrate it
if (typeof navigator !== 'undefined') {
  ReactDOM.hydrate(<AppRouter routeProps={window._PAGE} />, document.getElementById('root'))
}
