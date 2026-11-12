import PropTypes from 'prop-types'
import { Header } from '../include/components/index.js'

export function PageFrame({ children, header = true, headerProps = {} }) {
  return (
    <div className="wrap">
      {header && <Header title="React Markup" closeAriaLabel="창 닫기" {...headerProps} />}
      <main id="content">{children}</main>
    </div>
  )
}

PageFrame.propTypes = {
  children: PropTypes.node,
  header: PropTypes.bool,
  headerProps: PropTypes.object,
}
