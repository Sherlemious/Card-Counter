
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Adding strict mode for better development experience
import { StrictMode } from 'react'

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
