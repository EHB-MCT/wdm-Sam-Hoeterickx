import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Components
import { Root } from './modules/root';

//Style
import '~styles/base.css';


createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Root />
  // </StrictMode>,
)
