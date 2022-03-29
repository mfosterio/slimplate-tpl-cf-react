import { useState } from 'react'

export default function PageIndex () {
  const [n, setn] = useState(0)
  return (
    <>
      <h1>HELLO! {n} clicks.</h1>
      <p><button onClick={() => setn(n + 1)}>more</button></p>
    </>
  )
}
