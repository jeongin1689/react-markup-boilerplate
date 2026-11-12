import PropTypes from 'prop-types'

const cx = (...classes) => classes.filter(Boolean).join(' ')

export function Button({
  type = 'text',
  size = 'medium',
  color = 'filled',
  text = 'Button',
  isDisabled = false,
  ariaLabel = '',
  onClick,
}) {
  return (
    <button
      type="button"
      className={cx('btn', type && `btn_${type}`, size && `btn_${size}`, color && `btn_${color}`)}
      disabled={isDisabled}
      aria-label={ariaLabel || undefined}
      onClick={onClick}
    >
      <span className="btn_text">{text}</span>
    </button>
  )
}

Button.propTypes = {
  type: PropTypes.string,
  size: PropTypes.string,
  color: PropTypes.string,
  text: PropTypes.string,
  isDisabled: PropTypes.bool,
  ariaLabel: PropTypes.string,
  onClick: PropTypes.func,
}

export default Button
