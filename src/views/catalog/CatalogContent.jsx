import PropTypes from 'prop-types'
import { Button } from '../include/components/index.js'
import { CatalogLayout, VariantTable } from './CatalogLayout.jsx'

const rowsById = {
  '@button': [
    { label: '.btn.btn_medium.btn_filled', content: <Button text="Label" /> },
    { label: '.btn.btn_medium.btn_outline', content: <Button color="outline" text="Label" /> },
    { label: 'disabled', content: <Button text="Label" isDisabled /> },
  ],
}

const titleById = {
  '@button': 'Button',
}

export function CatalogContent({ id }) {
  const rows = rowsById[id]
  if (!rows) throw new Error(`Missing catalog content: ${id}`)
  return (
    <CatalogLayout title={titleById[id] || id} section={id.slice(1)}>
      <VariantTable rows={rows} />
    </CatalogLayout>
  )
}

CatalogContent.propTypes = { id: PropTypes.string.isRequired }
