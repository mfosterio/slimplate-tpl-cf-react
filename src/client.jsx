// this is the client-side entry point

import ReactDOM from 'react-dom'

import App from '~/app.jsx'

ReactDOM.hydrate(<App routeProps={window.__PAGE} />, document.getElementById('root'))
