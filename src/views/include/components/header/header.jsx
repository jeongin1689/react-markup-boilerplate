import PropTypes from 'prop-types'

export function Header({ title = 'Title', closeAriaLabel = '창 닫기' }) {
  return (
    <header className="page_header">
      <span aria-hidden="true" />
      <h1>{title}</h1>
      <button type="button" className="btn btn_icon" aria-label={closeAriaLabel}>×</button>
    </header>
  )
}

Header.propTypes = {
  title: PropTypes.string,
  closeAriaLabel: PropTypes.string,
}

export default Header
