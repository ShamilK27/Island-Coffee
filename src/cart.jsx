import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { CartPage } from './pages/CartPage.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartPage />
  </StrictMode>,
)
