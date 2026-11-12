import PropTypes from 'prop-types'
import { useTheme } from '../../app/ThemeProvider.jsx'

export function CatalogLayout({ title, section, children }) {
  const { mode, toggleMode } = useTheme()
  return (
    <>
      <main className="uio-wrap">
        <h1 className="page-title">{title}</h1>
        <strong className="uio-title">{section}</strong>
        {children}
      </main>
      <aside className="preview_controls">
        <button type="button" onClick={toggleMode}>
          {mode === 'dark' ? '라이트 모드' : '다크 모드'}
        </button>
      </aside>
    </>
  )
}

CatalogLayout.propTypes = {
  title: PropTypes.string.isRequired,
  section: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export function VariantTable({ rows }) {
  return (
    <div className="uio-box">
      <table className="uio-table">
        <thead>
          <tr>
            <th scope="col">Class / case</th>
            <th scope="col">Variant</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ label, content }) => (
            <tr key={label}>
              <td>{label}</td>
              <td>{content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

VariantTable.propTypes = {
  rows: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
    }),
  ).isRequired,
}
