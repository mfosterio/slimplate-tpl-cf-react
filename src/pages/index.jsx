import { useState, useEffect } from 'react'
import useWebSocket, { ReadyState } from 'react-use-websocket'

// this is called on the server-side for this route before/instead of the default componet export
// you can also return a Response object to ignore compoent (for server-side-only routes)
// if you set props, make sure they are simple objects (like JSON)
export async function server ({ request, env, ctx }) {
  return {
    status: 201,
    props: {
      message: 'Hi, from the server'
    }
  }
}

// this is called when a client requests a websocket
export async function socket (server) {
  // setup an interval that pushes messages out to client
  const r = setInterval(() => {
    server.send(`PUSHED: ${new Date()}`)
  }, 2000)

  // connection was opened, say "Hi"
  server.send('Hello!')

  // connection was closed, so stop sending
  server.addEventListener('close', (event) => {
    clearInterval(r)
  })

  // send a message when the client sends us a message
  server.addEventListener('message', (event) => {
    console.log(`Message from websocket client: ${event.data}`)
    server.send(`I got your message: ${event.data}`)
  })
}

export default function PageIndex ({ message }) {
  // this is for showing client-side state
  const [n, setn] = useState(0)

  // this sets up the websocket on client-side
  const [socketUrl, setSocketUrl] = useState(null)
  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl)
  useEffect(() => {
    setSocketUrl(document.location.origin.replace(/^http/, 'ws'))
  }, [])

  // this is for displaying status
  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated'
  }[readyState]

  return (
    <>
      <noscript>
        <h1>Interaction stuff requires javascript enabled.</h1>
      </noscript>

      <h1>HELLO!</h1>
      <hr />

      <p>Here is a demo of client-side state working:</p>
      <h2>{n} clicks</h2>
      <p><button onClick={() => setn(n + 1)}>moar clicks!!!!!</button></p>
      <hr />

      <p>This is the server-side data, from server(), loaded when this page was first rendered.</p>
      <pre>{message}</pre>

      <hr />
      <p>This came from the websocket ({connectionStatus}) <button onClick={() => sendMessage(new Date())}>send message</button>:</p>
      <pre>{lastMessage?.data}</pre>
    </>
  )
}
