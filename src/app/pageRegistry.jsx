import PropTypes from 'prop-types'
import { ThemeProvider } from './ThemeProvider.jsx'
import { pages } from './pageManifest.js'

const catalogModules = import.meta.glob('../views/catalog/@*.jsx', { eager: true })
const catalogPages = Object.fromEntries(
  Object.entries(catalogModules).map(([path, module]) => [
    path.match(/(@[^/]+)\.jsx$/)[1],
    module.default,
  ]),
)

const pageModules = import.meta.glob('../views/pages/[0-9]*.jsx', { eager: true })
const numberedPages = Object.fromEntries(
  Object.entries(pageModules).map(([path, module]) => [
    path.match(/\/([^/]+)\.jsx$/)[1],
    module.default,
  ]),
)
const implementedPages = { ...catalogPages, ...numberedPages }

const kindLabels = {
  page: '화면',
  component: '컴포넌트',
}

function PageList({ pages: items, compact = false }) {
  return (
    <ul className={`screen_index_list${compact ? ' is_compact' : ''}`}>
      {items.map((page) => (
        <li key={page.id}>
          <a href={`./views/${page.id}.html`}>
            {!compact && (
              <span className="screen_index_kind">{kindLabels[page.kind] || page.kind}</span>
            )}
            <strong className="screen_index_title">
              {page.id.startsWith('@') ? page.id.slice(1).replaceAll('_', ' ') : page.title}
            </strong>
            <code className="screen_index_id">{page.id}</code>
          </a>
        </li>
      ))}
    </ul>
  )
}

PageList.propTypes = { pages: PropTypes.arrayOf(PropTypes.object).isRequired, compact: PropTypes.bool }

function PageIndex() {
  const screens = pages.filter((page) => !page.id.startsWith('@'))
  const components = pages.filter((page) => page.id.startsWith('@'))

  return (
    <main className="screen_index">
      <header className="screen_index_head">
        <p className="screen_index_eyebrow">Boilerplate</p>
        <h1>React Markup</h1>
        <p className="screen_index_desc">화면 {screens.length} · 컴포넌트 {components.length}</p>
      </header>
      <section className="screen_index_section">
        <h2>화면 <span>{screens.length}</span></h2>
        <PageList pages={screens} />
      </section>
      <section className="screen_index_section">
        <h2>컴포넌트 <span>{components.length}</span></h2>
        <PageList pages={components} compact />
      </section>
    </main>
  )
}

export function PageApp({ pageId }) {
  if (pageId === '@index') return <ThemeProvider><PageIndex /></ThemeProvider>

  const page = pages.find((candidate) => candidate.id === pageId)
  if (!page) throw new Error(`Unknown page: ${pageId}`)

  const ImplementedPage = implementedPages[page.id]
  if (!ImplementedPage) throw new Error(`Missing React page implementation: ${page.id}`)
  return (
    <ThemeProvider>
      <ImplementedPage />
    </ThemeProvider>
  )
}

PageApp.propTypes = { pageId: PropTypes.string.isRequired }
