import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { pages } from './app/pageManifest.js'
import { PageApp } from './app/pageRegistry.jsx'

export { pages }

export function renderPage(pageId, pathname) {
  return renderToString(
    <MemoryRouter initialEntries={[pathname]}>
      <PageApp pageId={pageId} />
    </MemoryRouter>,
  )
}
