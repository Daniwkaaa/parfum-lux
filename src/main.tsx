import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/playfair-display/latin-400.css'
import '@fontsource/playfair-display/cyrillic-400.css'
import '@fontsource/playfair-display/latin-500.css'
import '@fontsource/playfair-display/cyrillic-500.css'
import '@fontsource/playfair-display/latin-400-italic.css'
import '@fontsource/playfair-display/cyrillic-400-italic.css'
import '@fontsource/playfair-display/latin-500-italic.css'
import '@fontsource/playfair-display/cyrillic-500-italic.css'
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/cyrillic-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/cyrillic-400.css'
import '@fontsource/jost/latin-500.css'
import '@fontsource/jost/cyrillic-500.css'
import '@fontsource/jost/latin-600.css'
import '@fontsource/jost/cyrillic-600.css'
import './index.css'
import App from './App'

const ThumbRenderer = lazy(() => import('./three/ThumbRenderer'))
const renderId = import.meta.env.DEV ? new URLSearchParams(location.search).get('render') : null

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {renderId ? (
      <Suspense fallback={null}>
        <ThumbRenderer id={renderId} />
      </Suspense>
    ) : (
      <App />
    )}
  </React.StrictMode>,
)
