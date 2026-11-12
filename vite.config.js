import { createReadStream, existsSync, statSync } from 'node:fs'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const projectRoot = dirname(fileURLToPath(import.meta.url))

const staticMimeTypes = {
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

function resolveSafeFile(directory, requestPath) {
  const relative = decodeURIComponent((requestPath || '').split('?')[0]).replace(/^\/+/, '')
  if (!relative || relative.includes('\0')) return null
  const rootDir = resolve(directory)
  const filePath = resolve(directory, relative)
  const prefix = rootDir.endsWith(sep) ? rootDir : `${rootDir}${sep}`
  if (filePath !== rootDir && !filePath.startsWith(prefix)) return null
  if (!existsSync(filePath) || !statSync(filePath).isFile()) return null
  return filePath
}

function sendStaticFile(response, filePath) {
  const type = staticMimeTypes[extname(filePath).toLowerCase()] || 'application/octet-stream'
  response.statusCode = 200
  response.setHeader('Content-Type', type)
  createReadStream(filePath).pipe(response)
}

function mpaDevPlugin() {
  const staticMounts = [
    ['/font', resolve(projectRoot, 'src/font')],
    ['/img', resolve(projectRoot, 'src/img')],
  ]
  const rootFiles = ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'favicon-180x180.png']

  return {
    name: 'mpa-dev-pages',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname

        for (const file of rootFiles) {
          if (pathname === `/${file}`) {
            const filePath = resolve(projectRoot, 'src', file)
            if (existsSync(filePath)) {
              sendStaticFile(response, filePath)
              return
            }
          }
        }

        for (const [prefix, directory] of staticMounts) {
          if (pathname === prefix || pathname.startsWith(`${prefix}/`)) {
            const filePath = resolveSafeFile(directory, pathname.slice(prefix.length))
            if (filePath) {
              sendStaticFile(response, filePath)
              return
            }
          }
        }

        return next()
      })

      server.middlewares.use(async (request, response, next) => {
        const pathname = new URL(request.url, 'http://localhost').pathname
        const match = pathname.match(/^\/views\/([^/]+)\.html$/)
        if (!match) return next()

        const pageId = decodeURIComponent(match[1])
        const html = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageId} | React Markup</title>
  </head>
  <body>
    <div id="root" data-page-id="${pageId}"></div>
    <script type="module" src="/src/entry-dev.jsx"></script>
  </body>
</html>`

        response.statusCode = 200
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.end(await server.transformIndexHtml(pathname, html))
      })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), mpaDevPlugin()],
  appType: 'mpa',
  server: {
    port: 3033,
  },
  build: isSsrBuild
    ? {
        outDir: '.ssr',
        emptyOutDir: true,
        rollupOptions: {
          output: { entryFileNames: 'entry-server.js' },
        },
      }
    : {
        outDir: 'dist',
        emptyOutDir: true,
        assetsInlineLimit: 0,
        rollupOptions: {
          input: 'src/entry-client.jsx',
          output: {
            entryFileNames: 'js/markup.js',
            chunkFileNames: 'js/[name].js',
            assetFileNames: (assetInfo) => {
              if (assetInfo.name?.endsWith('.css')) return 'css/markup.css'
              if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name ?? '')) return 'font/[name][extname]'
              return 'img/[name][extname]'
            },
            manualChunks(id) {
              if (id.includes('node_modules')) return 'libs'
              return undefined
            },
          },
        },
      },
}))
