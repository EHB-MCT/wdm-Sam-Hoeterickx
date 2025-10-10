import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Components
import { App } from '~modules/app/App';
import { Dashboard } from '~modules/dashboard/Dashboard';

//Style
import '~styles/base.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Dashboard />
  </StrictMode>,
)
