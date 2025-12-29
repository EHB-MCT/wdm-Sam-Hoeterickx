import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

//Components
import { Root } from './modules/root';

//Style
import '~styles/base.css';

/**
 * Application entry point that renders the root component.
 * Initializes React in strict mode with the main application structure.
 * 
 * @returns {void} - Renders the application to the DOM
 */
createRoot(document.getElementById('root')).render( <Root /> )
