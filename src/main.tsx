import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/themes.css'
import GlobalState from './globalState.tsx'
import React from 'react'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <GlobalState>
    <App />
    </GlobalState>
  </React.StrictMode>,
)