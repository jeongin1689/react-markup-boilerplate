import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { build } from 'vite'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const distRoot = resolve(projectRoot, 'dist')
const ssrRoot = resolve(projectRoot, '.ssr')

process.chdir(projectRoot)

await build()
const cssPath = resolve(distRoot, 'css', 'markup.css')
const compiledCss = await readFile(cssPath, 'utf8')
await writeFile(cssPath, compiledCss.replaceAll('../../../font/', '../font/'))
await build({ build: { ssr: 'src/entry-server.jsx' } })

const renderer = await import(`${pathToFileURL(resolve(ssrRoot, 'entry-server.js')).href}?t=${Date.now()}`)

function documentHtml({ pageId, title, body, depth = 0 }) {
  const prefix = depth ? '../' : './'
  const serializedPageId = JSON.stringify(pageId).replaceAll('<', '\\u003c')

  return `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" href="${prefix}favicon.ico">
    <link rel="stylesheet" href="${prefix}css/markup.css">
    <title>${title}</title>
  </head>
  <body>
    <div id="root" data-page-id=${JSON.stringify(pageId)}>${body}</div>
    <script>document.getElementById('root').dataset.pageId=${serializedPageId}</script>
    <script type="module" src="${prefix}js/markup.js"></script>
  </body>
</html>
`
}

const indexBody = renderer.renderPage('@index', '/@index.html')
await writeFile(
  resolve(distRoot, '@index.html'),
  documentHtml({ pageId: '@index', title: 'React Markup', body: indexBody }),
)

await writeFile(
  resolve(distRoot, 'index.html'),
  '<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=./@index.html"><title>React Markup</title></head><body><a href="./@index.html">화면 목록 열기</a></body></html>\n',
)

const viewsRoot = resolve(distRoot, 'views')
await mkdir(viewsRoot, { recursive: true })
for (const page of renderer.pages) {
  const pathname = `/views/${page.id}.html`
  const body = renderer.renderPage(page.id, pathname)
  await writeFile(
    resolve(viewsRoot, `${page.id}.html`),
    documentHtml({ pageId: page.id, title: `${page.title} | React Markup`, body, depth: 1 }),
  )
}

for (const directory of ['img', 'font']) {
  await cp(resolve(projectRoot, 'src', directory), resolve(distRoot, directory), {
    recursive: true,
    force: true,
  })
}

for (const favicon of ['favicon.ico', 'favicon-16x16.png', 'favicon-32x32.png', 'favicon-180x180.png']) {
  const from = resolve(projectRoot, 'src', favicon)
  await cp(from, resolve(distRoot, favicon), { force: true }).catch(() => {})
}

await writeFile(resolve(distRoot, '.nojekyll'), '')
await rm(ssrRoot, { recursive: true, force: true })
console.log(`Rendered ${renderer.pages.length} view pages`)
