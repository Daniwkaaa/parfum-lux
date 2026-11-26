import React, { Suspense, lazy } from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
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
