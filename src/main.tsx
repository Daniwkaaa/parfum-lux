import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/cyrillic-300.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/cyrillic-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/cyrillic-500.css'
import '@fontsource/cormorant-garamond/latin-300-italic.css'
import '@fontsource/cormorant-garamond/cyrillic-300-italic.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/cyrillic-400-italic.css'
import '@fontsource/manrope/latin-400.css'
import '@fontsource/manrope/cyrillic-400.css'
import '@fontsource/manrope/latin-500.css'
import '@fontsource/manrope/cyrillic-500.css'
import '@fontsource/manrope/latin-600.css'
import '@fontsource/manrope/cyrillic-600.css'
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
