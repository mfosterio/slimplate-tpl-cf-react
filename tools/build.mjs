import { build } from 'esbuild'
import pluginGlobImport from 'esbuild-plugin-import-glob'

build({
  entryPoints: ['src/server.jsx', 'src/client.jsx'],
  outdir: 'public/build',

  plugins: [pluginGlobImport.default()],
  bundle: true,
  target: 'esnext',
  format: 'esm',
  sourcemap: true,
  loader: {
    '.html': 'text',
    '.gql': 'text'
  },
  inject: [
    'tools/react-shim.js'
  ],
  external: [
    '../__STATIC_CONTENT_MANIFEST'
  ]
})
