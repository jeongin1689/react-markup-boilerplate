import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PageApp } from './app/pageRegistry.jsx'
import './css/scss/react.scss'

const root = document.getElementById('root')
const pageId = root.dataset.pageId || '@index'

createRoot(root).render(
  <StrictMode>
    <BrowserRouter>
      <PageApp pageId={pageId} />
    </BrowserRouter>
  </StrictMode>,
)
