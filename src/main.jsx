import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Analytics } from "@vercel/analytics/react";
import { TimeFormatProvider } from './context/TimeFormatContext.jsx';
import SettingsMount from './components/settings/SettingsMount.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TimeFormatProvider>
      {/* Settings UI mounted globally with fixed/portal-like behavior */}
      <SettingsMount />
      <App />
      <Analytics />
    </TimeFormatProvider>
  </StrictMode>,
)
