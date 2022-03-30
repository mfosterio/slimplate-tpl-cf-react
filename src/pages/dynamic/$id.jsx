// dynamic example: /dynamic/cool

export default function ({ params }) {
  return (
    <>
      <h2>Route Params:</h2>
      <pre>{JSON.stringify(params)}</pre>
    </>
  )
}
