// if you have a non-react page, just return a Response

/* global Response */

export function server ({ request, env, ctx }) {
  const time = new Date()
  return new Response(JSON.stringify({ cool: true, time }), {
    headers: {
      'content-type': 'application/json'
    }
  })
}
