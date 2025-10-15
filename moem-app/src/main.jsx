import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

console.log("API BASE URL:", import.meta.env.VITE_API_BASE_URL)

import { BrowserRouter, Routes, Route } from "react-router-dom";

<BrowserRouter>
  <Routes>

  </Routes>
</BrowserRouter>

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
