import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Components
import { App } from './modules/app/App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
